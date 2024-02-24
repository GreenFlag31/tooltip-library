import { Component } from '@angular/core';
import { TooltipDirective } from '../../../projects/ngx-tooltip-ease/src/lib/tooltip.directive';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [TooltipDirective],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.css',
})
export class ModalContentComponent {}
