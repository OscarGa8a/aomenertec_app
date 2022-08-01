import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { IonicModule } from '@ionic/angular';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RangePaginationPipe } from './pipes/range-pagination.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { ModalRechargeComponent } from './components/modal-recharge/modal-recharge.component';
import { ItemSettingComponent } from './components/item-setting/item-setting.component';
import { ImageHeaderComponent } from './components/image-header/image-header.component';
import { BalancePipe } from './pipes/balance.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalSettingComponent } from './components/modal-setting/modal-setting.component';
import { ModalConfirmationComponent } from './components/modal-confirmation/modal-confirmation.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { RoundedPipe } from './pipes/rounded.pipe';
import { ModalHelpComponent } from './components/modal-help/modal-help.component';

@NgModule({
  declarations: [
    MainHeaderComponent,
    PaginationComponent,
    RangePaginationPipe,
    ModalInfoComponent,
    ModalSettingComponent,
    ModalConfirmationComponent,
    ModalRechargeComponent,
    ModalHelpComponent,
    ItemSettingComponent,
    ImageHeaderComponent,
    BalancePipe,
    CapitalizePipe,
    RoundedPipe
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    MainHeaderComponent,
    PaginationComponent,
    RangePaginationPipe,
    ModalInfoComponent,
    ModalConfirmationComponent,
    ModalSettingComponent,
    ModalRechargeComponent,
    ItemSettingComponent,
    ImageHeaderComponent,
    BalancePipe,
    CapitalizePipe,
    RoundedPipe,
    ModalHelpComponent
  ]
})
export class SharedModule { }
