import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TooltipDirective } from '../../projects/ngx-tooltip-ease/src/lib/tooltip.directive';
import { ModalService } from 'ngx-modal-ease';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TooltipDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private modalService: ModalService) {}

  onOpen() {
    this.modalService.open(ModalContentComponent);
  }
}
