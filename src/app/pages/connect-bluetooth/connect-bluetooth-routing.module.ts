import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectBluetoothPage } from './connect-bluetooth.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectBluetoothPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectBluetoothPageRoutingModule {}
