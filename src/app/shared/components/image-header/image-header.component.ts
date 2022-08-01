import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalHelpComponent } from '../modal-help/modal-help.component';

@Component({
  selector: 'app-image-header',
  templateUrl: './image-header.component.html',
  styleUrls: ['./image-header.component.scss'],
})
export class ImageHeaderComponent implements OnInit {

  @Input() showInfo: boolean;
  @ViewChild(ModalHelpComponent) modalHelp: ModalHelpComponent;

  constructor() { }

  ngOnInit() {
  }

  openModalHelp(): void {
    this.modalHelp.openModal();
  }

}
