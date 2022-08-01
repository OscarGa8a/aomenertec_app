import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DashboardEndpoint } from '../endpoints/dashboard.endpoint';
import { ConnectionService } from './connection.service';
// import { WifiWizard2 } from '@ionic-native/wifi-wizard-2/ngx';
import to from 'await-to-js';
import { PagesService } from './pages.service';
import { LoadingService } from './loading.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const WifiWizard2: any;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  onClientDashboard: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  onDataDashboard: Subject<any> = new Subject<any>();
  onDataSettings: Subject<any> = new Subject<any>();
  onSendSettings: Subject<any> = new Subject<any>();
  // onDataDashboard2: Subject<any> = new Subject<any>();

  onSetStateDevice: Subject<any> = new Subject<any>();
  onRechargeDevice: Subject<any> = new Subject<any>();

  data: any;
  settingsData: any;

  dataArray: Array<any>;

  response = true;

  isConnectedNetwork = true;

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
    // private wifiWizard2: WifiWizard2,
    private loadingService: LoadingService,
    // private httpIonic: HTTP
  ) { }

  getDataDashboard(): Observable<any> {
    // return this.http.get(DashboardEndpoint.dataDashboard);
    return this.getPostEsp(DashboardEndpoint.dataDashboard,false, '');
  }

  getPostEsp(url: string,isPost: boolean,data: any): Observable<any>{
    if(!isPost){
      const resp = this.http.get(url);
      return resp;
    }
    else{
      const resp = this.http.post(url, data);
      return resp;
    }
    // return resp;
  }

  setStateDevice(orden: any): Observable<any> {
    // return this.http.post(DashboardEndpoint.stateDevice, orden);
    return this.getPostEsp(DashboardEndpoint.stateDevice, true,orden);
  }

  getStateDevice(): Observable<any> {
    // return this.http.get(DashboardEndpoint.stateDevice);
    return this.getPostEsp(DashboardEndpoint.stateDevice,false, '');
  }

  rechargeDevice(recharge: any): Observable<any> {
    // return this.http.post(DashboardEndpoint.rechargeDevice, recharge);
    return this.getPostEsp(DashboardEndpoint.rechargeDevice,true, recharge);
  }

  getConfigDevice(): Observable<any> {
    // return this.http.get(DashboardEndpoint.configDevice);
    return this.getPostEsp(DashboardEndpoint.configDevice,false, '');
  }

  setConfigDevice(config: any): Observable<any> {
    // return this.http.post(DashboardEndpoint.configDevice, config);
    return this.getPostEsp(DashboardEndpoint.configDevice,true,config);
  }

  async setStateDeviceIfConnect(orden2: any, isDashboard: boolean, numIntentos: number): Promise<void> {
    let puntos = '';
    console.log('num intentos: ', numIntentos);
    for (let i = 0; i < numIntentos; i++) {
      puntos += '.';
    }
    // if (!isDashboard) {
    await this.loadingService.createLoading(`Configurando estado${puntos}`);
    // }

    const credentials = this.connectionService.getCredentialsClient();

    let orden;

    if (isDashboard) {
      orden = {
        estado: orden2
      };
    } else {
      // console.log(typeof credentials);
      orden = {
        estado: credentials.orden
      };
    }

    console.log('set state credentials: ', credentials);

    if (PagesService.test) {
      const [error, response] = await to(this.setStateDevice(orden).toPromise());
      console.log(error, response);
      this.response = true;
      this.onSetStateDevice.next({
        error,
        response
      });
      console.log('after on set state subject');
    } else {

      const [errorSsid, ssid] = await to(WifiWizard2.getConnectedSSID());
      console.log('error ssid: ', errorSsid, ' ssid:', ssid);
      if (errorSsid || ssid !== credentials.ssid) {
        // this.onSetStateDevice.next({
        //   error: errorSsid,
        //   response: ssid
        // });
        const algoritm = 'WPA';
          // const [error, response] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
        // const [error, response] = await to(WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
        // console.log(error, response);

        const [error3, response3] = await to(WifiWizard2.suggestConnection(credentials.ssid, credentials.password, algoritm, false));
        let error;
        let response;
        if (error3) {
          const [errorConnect, responseConnect] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
          error = errorConnect;
          response = responseConnect;
        } else {
          const [errorSpecifier, responseSpecifier] = await to(
            WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
          error = errorSpecifier;
          response = responseSpecifier;
        }

        if (error) {
          this.response = true;
          this.onSetStateDevice.next({
            error,
            response
          });
        } else {
          console.log('No error conexión al dispositivo');
          const [error2, data] = await to(this.setStateDevice(orden).toPromise());
          console.log('SetState: ', data);
          this.response = true;
          this.onSetStateDevice.next({
            error: error2,
            response: data
          });
        }
      } else {

        const [error, data] = await to(this.setStateDevice(orden).toPromise());
        console.log('SetState: ', data);
        this.response = true;
        this.onSetStateDevice.next({
          error,
          response: data
        });
      }
    }

    // if (!isDashboard) {
      if (this.loadingService.loading) {
        console.log('quitar cargando estado');
        this.loadingService.loading.dismiss();
      }
      console.log('salir cargando estado');
    // }
  }

  async rechargeDeviceIfConnect(recharge: any, numIntentos: number): Promise<any> {
    let puntos = '';
    console.log('num intentos: ', numIntentos);
    for (let i = 0; i < numIntentos; i++) {
      puntos += '.';
    }
    // if (!isDashboard) {
    // await this.loadingService.createLoading(`Configurando estado${puntos}`);
    // if (!isDashboard) {
      await this.loadingService.createLoading(`Cargando codigo de recarga${puntos}`);
    // }

    const credentials = this.connectionService.getCredentialsClient();

    console.log('set state: ', credentials);

    if (PagesService.test) {
      const [error, response] = await to(this.rechargeDevice(recharge).toPromise());
      console.log(error, response);
      this.response = true;
      this.onRechargeDevice.next({
        error,
        response
      });
      console.log('after on recharge subject');
    } else {

      const [errorSsid, ssid] = await to(WifiWizard2.getConnectedSSID());
      console.log('error ssid: ', errorSsid, ' ssid:', ssid);
      if (errorSsid || ssid !== credentials.ssid) {
        // this.onRechargeDevice.next({
        //   error: errorSsid,
        //   response: ssid
        // });
        const algoritm = 'WPA';
        // const [error, response] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
        // const [error, response] = await to(WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
        // console.log(error, response);

        const [error3, response3] = await to(WifiWizard2.suggestConnection(credentials.ssid, credentials.password, algoritm, false));
        let error;
        let response;
        if (error3) {
          const [errorConnect, responseConnect] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
          error = errorConnect;
          response = responseConnect;
        } else {
          const [errorSpecifier, responseSpecifier] = await to(
            WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
          error = errorSpecifier;
          response = responseSpecifier;
        }


        if (error) {
          this.response = true;
          this.onRechargeDevice.next({
            error,
            response
          });
        } else {
          console.log('No error conexión al dispositivo');
          const [error2, data] = await to(this.rechargeDevice(recharge).toPromise());
          console.log('SetState: ', data);
          this.response = true;
          this.onRechargeDevice.next({
            error: error2,
            response: data
          });
        }
      } else {
        const [error, data] = await to(this.rechargeDevice(recharge).toPromise());
        console.log('Recharge: ', data);
        this.response = true;
        this.onRechargeDevice.next({
          error,
          response: data
        });
      }
    }

    // if (!isDashboard) {
      if (this.loadingService.loading) {
        this.loadingService.loading.dismiss();
      }
    // }
  }


  async getDataDashboardIfConnect(isDashboard: boolean, numIntentos: number): Promise<any> {

    let puntos = '';
    for (let i = 0; i < numIntentos; i++) {
      puntos += '.';
    }

    if (!isDashboard) {
      await this.loadingService.createLoading(`Obteniendo datos${puntos}`);
    }
    const credentials = this.connectionService.getCredentialsClient();
    // console.log(cre)
    console.log('get dashboard credentials: ', credentials);


    if (PagesService.test) {
      const [error, data] = await to(this.getDataDashboard().toPromise());
      console.log('error data dashboard: ', error);
      console.log('response data dashboard: ', data);
      this.response = true;
      this.onDataDashboard.next({
        error,
        response: data
      });
      if (!isDashboard) {
        this.setRequestDataDashboard(data);
      }

    } else {

      const [errorSsid, ssid] = await to(WifiWizard2.getConnectedSSID());
      console.log('error ssid: ', errorSsid, ' ssid:', ssid);
      if (errorSsid || ssid !== credentials.ssid) {
        // this.onDataDashboard.next({
        //   error: errorSsid,
        //   response: ssid
        // });
        const algoritm = 'WPA';
        // const [error, response] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
        // const [error, response] = await to(WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
        // console.log(error, response);

        const [error3, response3] = await to(WifiWizard2.suggestConnection(credentials.ssid, credentials.password, algoritm, false));
        let error;
        let response;
        if (error3) {
          const [errorConnect, responseConnect] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
          error = errorConnect;
          response = responseConnect;
        } else {
          const [errorSpecifier, responseSpecifier] = await to(
            WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
          error = errorSpecifier;
          response = responseSpecifier;
        }


        if (error) {
          this.response = true;
          this.onDataDashboard.next({
            error,
            response
          });
        } else {
          await this.getDashboard(isDashboard);
        }
      } else {
        await this.getDashboard(isDashboard);
      }
    }

    if (!isDashboard) {
      if (this.loadingService.loading) {
        this.loadingService.loading.dismiss();
      }
    }
  }

  async getDashboard(isDashboard: boolean): Promise<void> {
    const [error, data] = await to(this.getDataDashboard().toPromise());
    console.log('error data dashboard: ', error);
    console.log('response data dashboard: ', data);
    this.response = true;
    this.onDataDashboard.next({
      error,
      response: data
    });
    if (!isDashboard) {
      this.setRequestDataDashboard(data);
    }
  }

  async getDataSettingsIfConnect(numIntentos: number): Promise<any> {

    let puntos = '';
    for (let i = 0; i < numIntentos; i++) {
      puntos += '.';
    }

    await this.loadingService.createLoading(`Obteniendo configuracion${puntos}`);
    const credentials = this.connectionService.getCredentialsClient();
    // console.log(cre)
    console.log('get settings: ', credentials);

    if (PagesService.test) {
      const [error, data] = await to(this.getConfigDevice().toPromise());
      console.log('dataTest: ', data);
      this.response = true;
      this.onDataSettings.next({
        error,
        response: data
      });
      // if (!isDashboard) {
      //   this.setRequestDataDashboard(data);
      // }

    } else {

      const [errorSsid, ssid] = await to(WifiWizard2.getConnectedSSID());
      console.log('error ssid: ', errorSsid, ' ssid:', ssid);
      if (errorSsid || ssid !== credentials.ssid) {
        // this.onDataSettings.next({
        //   error: errorSsid,
        //   response: ssid
        // });
        const algoritm = 'WPA';
        // const [error, response] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
        // const [error, response] = await to(WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
        // console.log(error, response);

        const [error3, response3] = await to(WifiWizard2.suggestConnection(credentials.ssid, credentials.password, algoritm, false));
        let error;
        let response;
        if (error3) {
          const [errorConnect, responseConnect] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
          error = errorConnect;
          response = responseConnect;
        } else {
          const [errorSpecifier, responseSpecifier] = await to(
            WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
          error = errorSpecifier;
          response = responseSpecifier;
        }


        if (error) {
          this.response = true;
          this.onDataSettings.next({
            error,
            response
          });
        } else {
          console.log('No error conexión al dispositivo');
          const [error2, data] = await to(this.getConfigDevice().toPromise());
          console.log('DataSettings Service: ', data);
          this.response = true;
          this.onDataSettings.next({
            error: error2,
            response: data
          });
          this.setRequestDataSettings(data);
          // if (!isDashboard) {
          //   this.setRequestDataDashboard(data);
          // }
        }
      } else {
        const [error, data] = await to(this.getConfigDevice().toPromise());
        console.log('DataSettings Service: ', data);
        this.response = true;
        this.onDataSettings.next({
          error,
          response: data
        });
        this.setRequestDataSettings(data);
      }

    }
    if (this.loadingService.loading) {
      this.loadingService.loading.dismiss();
    }
  }

  async setConfigDeviceIfConnect(config: any, numIntentos: number): Promise<void> {

    let puntos = '';
    for (let i = 0; i < numIntentos; i++) {
      puntos += '.';
    }

    await this.loadingService.createLoading(`Enviando configuracion${puntos}`);
    const credentials = this.connectionService.getCredentialsClient();
    // console.log(cre)
    console.log('get credencials: ', credentials);

    if (PagesService.test) {
      console.log('config send: ',config);
      const [error, data] = await to(this.setConfigDevice(config).toPromise());
      console.log('dataTest: ', data, ' error: ',error);
      this.response = true;
      this.onSendSettings.next({
        error,
        response: data
      });

    } else {
      const [errorSsid, ssid] = await to(WifiWizard2.getConnectedSSID());
      console.log('error ssid: ', errorSsid, ' ssid:', ssid);
      if (errorSsid) {
        // this.onSendSettings.next({
        //   error: errorSsid,
        //   response: ssid
        // });
        const algoritm = 'WPA';
        // const [error, response] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
        // const [error, response] = await to(WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
        const [error3, response3] = await to(WifiWizard2.suggestConnection(credentials.ssid, credentials.password, algoritm, false));
        let error;
        let response;
        if (error3) {
          const [errorConnect, responseConnect] = await to(WifiWizard2.connect(credentials.ssid, true, credentials.password, algoritm));
          error = errorConnect;
          response = responseConnect;
        } else {
          const [errorSpecifier, responseSpecifier] = await to(
            WifiWizard2.specifierConnection(credentials.ssid, credentials.password, algoritm, false));
          error = errorSpecifier;
          response = responseSpecifier;
        }

        console.log(error, response);

        if (error) {
          this.response = true;
          this.onSendSettings.next({
            error,
            response
          });
        } else {
          console.log('No error conexión al dispositivo');
          const [error2, data] = await to(this.setConfigDevice(config).toPromise());
          console.log('SendSettings Service: ', data);
          this.response = true;
          this.onSendSettings.next({
            error: error2,
            response: data
          });
          // this.setRequestDataSettings(data);
          // if (!isDashboard) {
          //   this.setRequestDataDashboard(data);
          // }
        }
      } else {
        const [error, data] = await to(this.setConfigDevice(config).toPromise());
        console.log('SendSettings Service: ', data);
        this.response = true;
        this.onSendSettings.next({
          error,
          response: data
        });
        // this.setRequestDataSettings(data);
      }
    }
    if (this.loadingService.loading) {
      this.loadingService.loading.dismiss();
    }
  }

  setRequestDataDashboard(data: any): void {
    this.data = data;
  }

  setRequestDataSettings(data: any): void {
    this.settingsData = data;
  }

  getRequestDataDashboard(): any {
    return this.data;
  }

  getRequestDataSettings(): any {
    return this.settingsData;
  }

}
