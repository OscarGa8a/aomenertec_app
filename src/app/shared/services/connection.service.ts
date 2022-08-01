import { Injectable } from '@angular/core';
import { Credentials } from '../interfaces/users.interface';
import { Device } from '../interfaces/devices.interface';
import { HttpClient } from '@angular/common/http';
import { ConnectionEndpoint } from '../endpoints/connection.endpoint';
import { Observable } from 'rxjs';
import { UserClient } from '../interfaces/job-list.interface';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private credentialsClient: UserClient | Credentials
  ;

  constructor(
    private http: HttpClient,
  ) { }

  async verifyConnection(credentials: Credentials): Promise<Device> {
    // this.wifiWizard2.connect(ssid, bindAll, password, algorithm, isHiddenSSID)
    // const listNetworks = await this.wifiWizard2.listNetworks();
    // console.log(listNetworks);
    // this.wifiWizard2.connect(credentials.ssid, true, credentials.password);
    const devices = await this.getDevices().toPromise();

    const deviceConnect = devices.find(device =>
      device.ssid === credentials.ssid && device.password === credentials.password
    );

    if (deviceConnect) {
      return deviceConnect;
    } else {
      return null;
    }

  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(ConnectionEndpoint.authenticateDevice);
  }

  getCredentialsClient(): UserClient | Credentials {
    return this.credentialsClient;
  }

  setCredentialsClient(credentials: UserClient | Credentials) {
    this.credentialsClient = credentials;
  }
}
