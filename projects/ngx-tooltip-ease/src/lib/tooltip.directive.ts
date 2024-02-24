import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[ngxTooltip]',
  standalone: true,
})
export class TooltipDirective implements AfterViewInit {
  @Input() content = '';
  @Input() position: 'top' | 'bottom' = 'bottom';
  @Input() animation = 'scale-up fade-in';
  @Input() animationFn = 'ease-out';
  @Input() animationMs = '200';
  @Input() offsetSpace = 5;

  private tooltip!: HTMLSpanElement;

  constructor(private element: ElementRef<HTMLButtonElement>) {}

  get native() {
    return this.element.nativeElement;
  }

  ngAfterViewInit() {}

  @HostListener('mouseleave')
  onLeave() {
    this.tooltip?.remove();
  }

  @HostListener('mouseenter')
  onEnter() {
    if (this.content.trim().length === 0) return;

    const { left, top, bottom } = this.native.getBoundingClientRect();
    this.tooltip = document.createElement('p');
    this.tooltip.classList.add('ngx-tooltip');
    this.appendContent();

    const tooltipWidth = this.tooltip.clientWidth;
    const tooltipHeight = this.tooltip.clientHeight;
    const buttonWidth = this.native.clientWidth;
    const oneSideWidthDif = (tooltipWidth - buttonWidth) / 2;
    const [parentPositionedTopCorrection, parentPositionedLeftCorrection] =
      this.correctionParentPositioned();

    let tooltipTop =
      top - tooltipHeight - this.offsetSpace - parentPositionedTopCorrection;

    if (tooltipTop < 0) {
      // no space on top
      tooltipTop = bottom + this.offsetSpace;
    }

    // align middle
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

    this.tooltip.style.top = `${tooltipTop}px`;
    this.tooltip.style.left = `${leftPosition}px`;
    this.tooltip.style.animation = this.buildAnimations();
  }

  buildAnimations() {
    let animationApplied = '';
    const splittedAnimations = this.animation.split(' ');

    for (const animation of splittedAnimations) {
      animationApplied += `${animation} ${this.animationMs}ms ${this.animationFn}, `;
    }

    animationApplied = animationApplied.substring(
      0,
      animationApplied.length - 2
    );

    return animationApplied;
  }

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
