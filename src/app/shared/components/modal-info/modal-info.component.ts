import { Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDataModalInfo } from '@shared/interfaces/connection.interface';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  @ViewChild('modalInfo') elementModal: ElementRef;

  infoModal: IDataModalInfo = {
    title: '',
    description: '',
    isError: true
  };

  constructor(
    private modalInfo: NgbModal,
  ) { }

  ngOnInit() {
  }

  openModal(title: string, description: string, isError: boolean): void {
    this.closeModal();
    this.setDataModal(title, description, isError);
    this.modalInfo.open(this.elementModal, {windowClass: 'modal-info', centered: true});
  }

  setDataModal(title: string, description: string, isError: boolean): void {
    this.infoModal.title = title;
    this.infoModal.description = description;
    this.infoModal.isError = isError;
  }

  closeModal(): void {
    this.modalInfo.dismissAll();
  }
}
