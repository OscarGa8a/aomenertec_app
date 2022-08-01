import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';

@Injectable({
  providedIn: 'root'
})
export class HandleBluetoothService {

  constructor(private bluetoothService: BluetoothService) { }

  async verifyBluetooth(): Promise<number> {
    const [errorEnabled, responseEnabled] = await this.bluetoothService.isEnabled();
    console.log('isEnabled: ', errorEnabled, responseEnabled);

    if (errorEnabled) {
      const [errorEnable, responseEnable] = await this.bluetoothService.enable();
      console.log('enable: ', errorEnable, responseEnable);

      if (errorEnable) { return 0; }
    }

    const [error, response] = await this.bluetoothService.isConnected();

    console.log('isConnect: ', error, response);

    if (response) {
      const [errorDisconnect, responseDisconnect] = await this.bluetoothService.disconnect();
      console.log('disconnect: ', errorDisconnect, responseDisconnect);
      if (errorDisconnect) { return 1; }
    }

    return 2;
  }
}
