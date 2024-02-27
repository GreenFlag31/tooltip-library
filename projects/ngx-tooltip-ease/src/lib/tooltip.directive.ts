import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ngxTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input() content = '';
  @Input() position: 'top' | 'bottom' = 'top';
  @Input() animation = 'scale-up fade-in';
  @Input() animationFn = 'ease-out';
  @Input() animationMs = '200';
  @Input() offsetSpace = 5;
  @Input() disable = false;

  private tooltip!: HTMLSpanElement;

  constructor(private element: ElementRef<HTMLButtonElement>) {}

  get native() {
    return this.element.nativeElement;
  }

  get nativeRect() {
    return this.native.getBoundingClientRect();
  }

  @HostListener('mouseleave')
  onLeave() {
    this.tooltip?.remove();
  }

  @HostListener('mouseenter')
  onEnter() {
    if (this.content.trim().length === 0 || this.disable) return;

    this.tooltip = document.createElement('p');
    this.tooltip.classList.add('ngx-tooltip');
    this.appendContent();

    const [parentPositionedTopCorrection, parentPositionedLeftCorrection] =
      this.correctionParentPositioned();

    const topPosition = this.computeTopPosition(parentPositionedTopCorrection);
    const leftPosition = this.computeLeftPosition(
      parentPositionedLeftCorrection
    );

    this.tooltip.style.top = `${topPosition}px`;
    this.tooltip.style.left = `${leftPosition}px`;
    this.tooltip.style.animation = this.buildAnimations();
  }

  /**
   * Compute left position according to the available space and user choice.
   * If the tooltip width is greater than the windown width, add an ellipsis.
   */
  computeLeftPosition(parentPositionedLeftCorrection: number) {
    const { left } = this.nativeRect;
    const tooltipWidth = this.tooltip.clientWidth;
    const buttonWidth = this.native.clientWidth;
    const oneSideWidthDif = (tooltipWidth - buttonWidth) / 2;

    // align middle by default
    let leftPosition = left - oneSideWidthDif - parentPositionedLeftCorrection;
    if (oneSideWidthDif > 0) {
      // text overflows
      if (leftPosition < 0) {
        // align (push) right
        leftPosition += oneSideWidthDif;
      } else if (left + tooltipWidth > window.innerWidth) {
        // align (push) left
        leftPosition -= oneSideWidthDif;
      }
    }

    this.tooltip.style.maxWidth = '100%';
    if (tooltipWidth > window.innerWidth) {
      this.tooltip.classList.add('ngx-ellipsis');
      this.tooltip.style.maxWidth = `${this.native.clientWidth}px`;
    }

    return leftPosition;
  }

  /**
   * Compute top position according to the available space and user choice.
   */
  computeTopPosition(parentPositionedTopCorrection: number) {
    const { top, bottom } = this.nativeRect;
    const tooltipHeight = this.tooltip.clientHeight;

    const tooltipTopPosition =
      top - tooltipHeight - this.offsetSpace - parentPositionedTopCorrection;

    let topPosition = tooltipTopPosition;
    if (topPosition < 0 || this.position === 'bottom') {
      // no space on top, put it on bottom (or user position choice)
      topPosition = bottom + this.offsetSpace;
    }

    if (
      this.position === 'bottom' &&
      topPosition + tooltipHeight + parentPositionedTopCorrection >
        window.innerHeight
    ) {
      // no space on bottom, put it on top
      topPosition = tooltipTopPosition;
    }

    return topPosition;
  }

  buildAnimations() {
    let animationApplied = [];
    const splittedAnimations = this.animation.split(' ');

    for (const animation of splittedAnimations) {
      animationApplied.push(
        `${animation} ${this.animationMs}ms ${this.animationFn}`
      );
    }

    return animationApplied.join(', ');
  }

  /**
   * Append content with possible line return.
   */
  appendContent() {
    const splittedContent = this.content.split('\\n');

    if (splittedContent.length === 1) {
      this.tooltip.innerText = this.content;
    } else {
      for (const text of splittedContent) {
        this.tooltip.append(text);
        const br = document.createElement('br');
        this.tooltip.appendChild(br);
      }
    }

    this.native.after(this.tooltip);
  }

  /**
   * If a parent has a non static positioning AND a transform value, CSS rules about positioning take the parent as position reference. Not the direct parent (ancestors > 1).
   */
  correctionParentPositioned() {
    let parentPositionedTopCorrection = 0;
    let parentPositionedLeftCorrection = 0;
    let ancestors = 0;
    let parentElement = (this.native.parentNode as HTMLElement) || null;
    while (parentElement) {
      const computedStyles = window.getComputedStyle(parentElement);
      const parentPos = computedStyles.getPropertyValue('position');

      if (
        (parentPos === 'absolute' || parentPos === 'fixed') &&
        ancestors > 0
      ) {
        const { top, left } = parentElement.getBoundingClientRect();
        const transformed = computedStyles.getPropertyValue('transform');
        if (transformed !== 'none') {
          parentPositionedTopCorrection = top;
          parentPositionedLeftCorrection = left;
        }
        break;
      } else if (parentPos === 'relative') break;

      parentElement = parentElement.parentNode as HTMLElement;
      if (parentElement.nodeName === '#document') break;
      ancestors += 1;
    }

    return [parentPositionedTopCorrection, parentPositionedLeftCorrection];
  }
}
