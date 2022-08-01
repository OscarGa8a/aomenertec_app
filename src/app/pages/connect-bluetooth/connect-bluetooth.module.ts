import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectBluetoothPageRoutingModule } from './connect-bluetooth-routing.module';

import { ConnectBluetoothPage } from './connect-bluetooth.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ConnectBluetoothPageRoutingModule,
    SharedModule
  ],
  declarations: [ConnectBluetoothPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectBluetoothPageModule {}
