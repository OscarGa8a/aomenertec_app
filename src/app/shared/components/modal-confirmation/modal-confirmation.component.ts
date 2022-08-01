import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDataModalInfo } from '../../interfaces/connection.interface';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss'],
})
export class ModalConfirmationComponent implements OnInit {

  @ViewChild('modalConfirmation') confirmation: any;
  @Output() sendConfirm = new EventEmitter();

  infoModal: IDataModalInfo = {
    title: '',
    description: ''
  };

  constructor(private modalConfirmation: NgbModal) { }

  ngOnInit() {}

  openModal(title: string, description: string): void {
    this.setDataModal(title, description);
    this.modalConfirmation.open(this.confirmation, {windowClass: 'modal-setting', centered: true});
  }

  setDataModal(title: string, description: string): void {
    this.infoModal.title = title;
    this.infoModal.description = description;
  }

  confirm(): void {
    this.closeModal();
    this.sendConfirm.emit();
  }

  closeModal(): void {
    this.modalConfirmation.dismissAll();
  }

}
