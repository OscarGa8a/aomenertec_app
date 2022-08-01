import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-setting',
  templateUrl: './modal-setting.component.html',
  styleUrls: ['./modal-setting.component.scss']
})
export class ModalSettingComponent implements OnInit {

  @ViewChild('modalSetting') connection: any;
  @Input() title = 'Error de conexión';
  @Input() description = 'Nombre de red no encontrado';
  @Input() isSuccess = false;

  constructor(private modalSetting: NgbModal) { }

  ngOnInit() {
  }

  openModal(): void {
    this.modalSetting.open(this.connection, {windowClass: 'modal-setting', centered: true});
  }

  closeModal(): void {
    this.modalSetting.dismissAll();
  }
}
