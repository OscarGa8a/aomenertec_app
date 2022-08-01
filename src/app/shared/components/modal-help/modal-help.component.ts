import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-help',
  templateUrl: './modal-help.component.html',
  styleUrls: ['./modal-help.component.scss'],
})
export class ModalHelpComponent implements OnInit {

  @ViewChild('modalHelp') elementModal: ElementRef;

  constructor(private modalHelp: NgbModal) { }

  ngOnInit() {}

  openModal(): void {
    this.modalHelp.open(this.elementModal, {windowClass: 'modal-help', centered: true});
  }

  closeModal(): void {
    this.modalHelp.dismissAll();
  }
}
