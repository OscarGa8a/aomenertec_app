import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-recharge',
  templateUrl: './modal-recharge.component.html',
  styleUrls: ['./modal-recharge.component.scss'],
})
export class ModalRechargeComponent {

  @ViewChild('modalRecharge') recharge: any;
  @Input() title = 'Error de recarga';
  @Input() description = 'Código de recarga incorrecto';
  @Input() saldoRecarga = 36;
  @Input() saldo = 48;
  @Input() isSuccess = false;
  @Input() status: '';
  @Input() error: '';
  @Input() resp: any;

  constructor(
    private modalRecharge: NgbModal,
    private modalService: ModalService
  ) {
  }

  openModal(): void {
    this.modalRecharge.open(this.recharge, {windowClass: 'modal-recharge', centered: true});
  }

}
