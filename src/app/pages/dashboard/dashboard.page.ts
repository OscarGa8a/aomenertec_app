import { Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ModalInfoComponent } from '@app/shared/components/modal-info/modal-info.component';
import { take, takeUntil, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticateService } from '@shared/services/authenticate.service';
import { DashboardService } from '@shared/services/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ModalRechargeComponent } from '@shared/components/modal-recharge/modal-recharge.component';
import { ConnectionService } from '@shared/services/connection.service';
import { PagesService } from '@shared/services/pages.service';
import { KEY_USER_LOGGED } from '@shared/utils/constants';
import { StorageService } from '@shared/services/storage.service';
import { toFormControl } from '@shared/utils/forms';
import { LoadingService } from '../../shared/services/loading.service';
import { KEY_DEVICES_MODIFIES } from '@shared/utils/constants';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { BluetoothService } from '@app/shared/services/bluetooth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  @ViewChild(ModalInfoComponent) modalInfo: ModalInfoComponent;

  @ViewChild(ModalConfirmationComponent) modalConfirmation: ModalConfirmationComponent;

  @ViewChild(ModalRechargeComponent) modalRechargue: ModalRechargeComponent;

  @ViewChild('contentDashboard') contentDashboard: ElementRef;

  isOpenConfig = false;

  role: number;

  plusTop = 0;

  infoDashboard: any;

  user: any;

  client: any;

  interval: any;

  dashboardForm: FormGroup;

  unsubscribe = new Subject();

  respRecharge: any;

  numErrors = 0;

  numMaxErrors = 4;

  closeModal = true;

  isClosePage = false;

  dataRecharge: any;

  toControl = toFormControl;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private connectionService: ConnectionService,
    private loadingService: LoadingService,
    private storageService: StorageService,
    private bluetoothService: BluetoothService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {

    this.getUserLogged();

    this.setHeigthContent();

    this.createForm();

    this.client = this.connectionService.getCredentialsClient();

    // this.dashboardService.onDataDashboard
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(response => {
    //     if (!this.isClosePage) {
    //       this.handleOnDataDashboard(response);
    //     }
    //   });

    // this.dashboardService.onDataSettings
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(response => {
    //     if (!this.isClosePage) {
    //       this.handleOnDataSettings(response);
    //     }
    //   });

    // this.dashboardService.onSetStateDevice
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(response => {
    //     if (!this.isClosePage) {
    //       this.handleOnDataState(response);
    //     }
    //   });

    //  this.dashboardService.onRechargeDevice
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(response => {
    //     if (!this.isClosePage) {
    //       this.handleOnRecharge(response);
    //     }
    //   });
  }

  // handleOnRecharge(response: any): void {
  //   if (response.error) {
  //     this.numErrors++;
  //     if (this.numErrors < this.numMaxErrors) {
  //       this.dashboardService.rechargeDeviceIfConnect(this.dataRecharge, this.numErrors + 1);
  //     } else {
  //       this.openModalInfo(
  //         'Error de Intentos',
  //         `No se pudo recargar el dispositivo después de ${this.numMaxErrors} intentos`, true);
  //       this.closeModal = false;
  //       this.numErrors = 0;
  //       this.getDataDashboardInterval();
  //     }
  //   } else {
  //     if (response.response.error && response.response.error !== 'Codigo Incorrecto') {
  //       this.numErrors++;
  //       if (this.numErrors < this.numMaxErrors) {
  //         this.dashboardService.rechargeDeviceIfConnect(this.dataRecharge, this.numErrors + 1);
  //       } else {
  //         this.openModalInfo(
  //           'Error de Intentos',
  //           `No se pudo recargar el dispositivo después de ${this.numMaxErrors} intentos`, true);
  //         this.closeModal = false;
  //         this.numErrors = 0;
  //         this.getDataDashboardInterval();
  //       }
  //     } else {
  //       this.numErrors = 0;
  //       this.respRecharge = response.response;
  //       this.getDataDashboardInterval();
  //       this.modalRechargue.openModal();
  //     }
  //   };
  // }

  // handleOnDataState(response: any): void {
  //   if (response.error) {
  //     this.numErrors++;
  //     if (this.numErrors < this.numMaxErrors) {
  //       this.dashboardService.setStateDeviceIfConnect(this.connectionService.getCredentialsClient(), false, this.numErrors + 1);
  //     } else {
  //       this.openModalInfo(
  //         'Error de Intentos',
  //         `No se pudo configurar el estado del dispositivo después de ${this.numMaxErrors} intentos`, true);
  //       this.closeModal = false;
  //       this.numErrors = 0;
  //       this.getDataDashboardInterval();
  //     }
  //   } else {
  //     if (response.response.error) {
  //       this.numErrors++;
  //       if (this.numErrors < this.numMaxErrors) {
  //         this.dashboardService.setStateDeviceIfConnect(this.connectionService.getCredentialsClient(), false, this.numErrors + 1);
  //       } else {
  //         this.openModalInfo(
  //           'Error de Intentos',
  //           `No se pudo configurar el estado del dispositivo después de ${this.numMaxErrors} intentos`, true);
  //         this.closeModal = false;
  //         this.numErrors = 0;
  //         this.getDataDashboardInterval();
  //       }
  //     } else {
  //       this.numErrors = 0;
  //       this.infoDashboard = response.response;
  //       this.getDataDashboardInterval();
  //       this.modalInfo.openModal('Accion Exitosa','Envio de nuevo estado del dispositivo exitoso',false);
  //     }
  //   }
  // }

  // handleOnDataDashboard(response: any): void {
  //   if (response.error) {
  //     this.numErrors++;
  //     if (this.numErrors < this.numMaxErrors) {
  //       this.openModalInfo('Error Data', 'Error obteniendo los datos del dispositivo', true);
  //     } else {
  //       this.openModalInfo(
  //         'Error de Intentos',
  //         `No se pudo obtener los datos del dispositivo después de ${this.numMaxErrors} intentos`, true);
  //       this.closeModal = false;
  //       this.router.navigate(['/job-list']);
  //     }
  //   } else {
  //     if (response.response.error) {
  //       this.numErrors++;
  //       if (this.numErrors < this.numMaxErrors) {
  //         this.openModalInfo('Error Timeout', 'Error por tiempo de espera', true);
  //       } else {
  //         this.openModalInfo(
  //           'Error de Intentos',
  //           `No se pudo obtener los datos del dispositivo después de ${this.numMaxErrors} intentos`, true);
  //         this.closeModal = false;
  //         this.router.navigate(['/job-list']);
  //       }
  //     } else {
  //       this.numErrors = 0;
  //       this.infoDashboard = response.response;
  //     }
  //   };
  // }

  // handleOnDataSettings(response: any): void {
  //   if (response.error) {
  //     this.numErrors++;
  //     if (this.numErrors < this.numMaxErrors) {
  //       this.dashboardService.getDataSettingsIfConnect(this.numErrors + 1);
  //     } else {
  //       this.openModalInfo(
  //         'Error de Intentos',
  //         `No se pudo obtener la configuración del dispositivo después de ${this.numMaxErrors} intentos`, true);

  //       this.numErrors = 0;
  //       this.getDataDashboardInterval();
  //     }
  //   } else {
  //     if (response.response.error) {
  //       this.numErrors++;
  //       if (this.numErrors < this.numMaxErrors) {
  //         this.dashboardService.getDataSettingsIfConnect(this.numErrors + 1);
  //       } else {
  //         this.openModalInfo(
  //           'Error de Intentos',
  //           `No se pudo obtener la configuración del dispositivo después de ${this.numMaxErrors} intentos`, true);
  //         this.numErrors = 0;
  //         this.getDataDashboardInterval();
  //       }
  //     } else {
  //       this.numErrors = 0;
  //       this.getDataDashboard();
  //       this.dashboardService.setRequestDataSettings(response.response);
  //       this.router.navigate(['/settings']);
  //     }
  //   };
  // }

  ionViewWillEnter() {
    this.isClosePage = false;
    this.getDataDashboardInterval();
  }

  async getUserLogged(): Promise<void> {
    if (PagesService.test && localStorage.getItem(KEY_USER_LOGGED)) {
      this.user = JSON.parse(localStorage.getItem(KEY_USER_LOGGED));
      this.role = this.user.role_id;
    } else if (!PagesService.test && await this.storageService.isStorage(KEY_USER_LOGGED)) {
      this.user = JSON.parse(await this.storageService.getStorage(KEY_USER_LOGGED));
      this.role = this.user.role_id;
    } else if (this.authenticateService.getUserLogin()) {
      this.user = this.authenticateService.getUserLogin();
      this.role = this.user.role_id;
    } else if (this.role !== 5) {
      this.user = null;
      this.role = 0;
      this.plusTop = 3;
    }
  }

  createForm(): void {
    this.dashboardForm = this.fb.group({
      recharge: ''
    });

    this.valuesChangesForm();
  }

  async getDataDashboard(): Promise<void> {

    this.infoDashboard = this.dashboardService.getRequestDataDashboard();

    // this.interval = setInterval(() => {
    //   // this.dashboardService.getDataDashboardIfConnect(true, 1);
    //   console.log('activando intervallllllllllllllllllll');
    //   this.getInfo();

    // }, 15000);

    this.getInfo();

    this.interval = setTimeout(() => {
      console.log('activando intervallllllllllllllllllll');
      this.getInfo();
    }, 15000);
  }

  async getInfo(): Promise<void> {
    let [error, response] = await this.bluetoothService.isConnected();
    console.log('is connect: ', error, response);

    if (error) {
      this.openModalInfo(
        'Error de conexión',
        'No se puedo conectar al dispositivo',
        true
      );
      return;
    }

    [error, response] = await this.bluetoothService.write('DASH+');
    console.log('write: ', error, response);

    console.log('antes subscribe');

    this.bluetoothService.subscribe('+')
      .pipe(
        timeout(20000),
        take(1)
      )
      .subscribe(
        resp => this.responseDataDashboard(resp),
        err => this.errorResponseDataDashboard()
      );

    console.log('después de subscribe');
  }

  errorResponseDataDashboard(): void {
    console.log('error response');

    this.openModalInfo(
      'Error de comunicación',
      'No se pudo obtener la información del dispositivo',
      true
    );
  }

  responseDataDashboard(resp: string): void {
    console.log(resp);
    this.loadingService.loading.dismiss();

    const stringJSON = resp.slice(0, resp.length - 1);
    let data;
    try {
      data = JSON.parse(stringJSON);
    } catch (err) {
      console.log('error convirtiendo a josn ', err);
      this.errorResponseDataDashboard();
      return;
    }
    console.log(data);
    this.dashboardService.setRequestDataDashboard(data);
    this.ngZone.run(() => this.infoDashboard = data);
  }


  async getDataDashboardInterval(): Promise<void> {
    // this.dashboardService.getDataDashboardIfConnect(false, 1);

    await this.getDataDashboard();
  }

  valuesChangesForm(): void {
    Object.keys(this.dashboardForm.controls).forEach(key => {
      this.dashboardForm.get(key).valueChanges
        .pipe(takeUntil(this.unsubscribe));
    });
  }

  async onRecharge(): Promise<void> {
    clearInterval(this.interval);
    this.dataRecharge = {
      codigo: this.dashboardForm.get('recharge').value
    };

    await this.dashboardService.rechargeDeviceIfConnect(this.dataRecharge, 1);
  }

  async recharge(): Promise<void> {
    clearInterval(this.interval);

    let [error, response] = await this.bluetoothService.isConnected();
    console.log('is connect: ', error, response);

    if (error) {
      this.openModalInfo(
        'Error de conexión',
        'No se puedo conectar al dispositivo',
        true
      );

      this.getDataDashboard();
      return;
    }

    await this.loadingService.createLoading('Recargando...');

    const command = `RECA${this.dashboardForm.get('recharge').value}+`;
    console.log(command);

    [error, response] =
      await this.bluetoothService.write(command);

    console.log('write set: ', error, response);


    this.bluetoothService.subscribe('+')
      .pipe(
        timeout(20000),
        take(1)
      )
      .subscribe(
        resp => this.responseRecharge(resp),
        err => this.errorResponseRecharge()
      );
  }

  responseRecharge(resp: string): void {
    console.log('responseRecharge: ', resp);
    this.loadingService.loading.dismiss();

    const stringJSON = resp.slice(0, resp.length - 1);
    let respRecharge;
    try {
      respRecharge = JSON.parse (stringJSON);
    } catch(err) {
      console.log('error convirtiendo a json ', err);
      this.errorResponseRecharge();
      return;
    }
    console.log('respRecharge: ', respRecharge);

    this.respRecharge = respRecharge;
    this.modalRechargue.openModal();
    this.getDataDashboard();
    // this.openModalInfo(
    //   'Accion exitosa',
    //   'El cambio de estado ha sido exitoso',
    //   false
    // );
  }

  errorResponseRecharge(): void {
    console.log('error response');
    this.loadingService.loading.dismiss();

    this.openModalInfo(
      'Error Comunicación',
      'No se pudo recargar el dispositivo',
      true
    );

    this.getDataDashboard();
  }


  async setHeigthContent(): Promise<void> {
    await new Promise((r, j) => setTimeout(() => { r(true); }, 500));
    // @ts-ignore
    document.querySelector('.content-dashboard').style.height =
      `calc(100vh - 66.58px - 111.18px - 130px - 25px + ${this.plusTop}px)`;
  }

  async setConfig(): Promise<void> {
    const config = {
      uid: '564565',
      did: '466664',
      fecha: '02/06/20',
      consec: 0,
      nominalDc: 24,
      nominalAc: 1000,
      minAc: 100,
      maxAc: 800,
      credito: 100,
      subsidio: 80
    };
    console.log(await this.dashboardService.setConfigDevice(config).toPromise());

  }

  async setStateDevice(): Promise<void> {
    clearInterval(this.interval);

    let [error, response] = await this.bluetoothService.isConnected();
    console.log('is connect: ', error, response);

    if (error) {
      this.openModalInfo(
        'Error de conexión',
        'No se puedo conectar al dispositivo',
        true
      );

      this.getDataDashboard();
      return;
    }

    await this.loadingService.createLoading('Configurando estado...');

    console.log(`esta${this.infoDashboard.estado === 'habilitado' ? '0' : '1'}+`);

    [error, response] =
      await this.bluetoothService.write(`esta${this.infoDashboard.estado === 'habilitado' ? '0' : '1'}+`);

    console.log('write set: ', error, response);

    console.log('antes de subscribe');
    this.bluetoothService.subscribe('+')
      .pipe(
        timeout(20000),
        take(1)
      )
      .subscribe(
        resp => this.responseSetSate(resp),
        err => this.errorResponseSetState()
      );

    console.log('después de subscribe');
  }

  responseSetSate(resp: string): void {
    console.log('respone set state: ', resp);
    const stringJSON = resp.slice(0, resp.length - 1);
    let dataConexion;
    try {
      dataConexion = JSON.parse(stringJSON);
    } catch (err) {
      console.log('error convirtiendo a json ', err);
      this.errorResponseSetState();
      return;
    }
    console.log('dataconexión: ', dataConexion);

    if (dataConexion.status === 'ok') {
      this.loadingService.loading.dismiss();

      this.openModalInfo(
        'Accion exitosa',
        'El cambio de estado ha sido exitoso',
        false
      );

      this.infoDashboard.estado = dataConexion.estado;
      this.getDataDashboard();
      // this.infoDashboard = response.response;
      // this.getDataDashboardInterval();
    } else {
      this.errorResponseSetState();
    }
  }

  errorResponseSetState(): void {
    console.log('error response');
    this.loadingService.loading.dismiss();

    this.openModalInfo(
      'Error Comunicación',
      'No se pudo configurar el estado del dispositivo',
      true
    );

    this.getDataDashboard();
  }

  // async goToSetting(): Promise<void> {
  //   this.isOpenConfig = false;
  //   clearInterval(this.interval);
  //   // await this.loadingService.createLoading('Obteniedo configuracion...');
  //   await this.dashboardService.getDataSettingsIfConnect(1);
  //   if (this.loadingService.loading) {
  //     this.loadingService.loading.dismiss();
  //   }
  // }

  async getSettings(): Promise<void> {
    this.isOpenConfig = false;
    clearInterval(this.interval);

    let [error, response] = await this.bluetoothService.isConnected();
    console.log('is connect: ', error, response);

    if (error) {
      this.openModalInfo(
        'Error de conexión',
        'No se puedo conectar al dispositivo',
        true
      );

      this.getDataDashboard();
      return;
    }

    await this.loadingService.createLoading('Obteniendo configuración...');

    [error, response] = await this.bluetoothService.write(`CONF+`);

    console.log('write set: ', error, response);

    console.log('antes de subscribe');

    this.bluetoothService.subscribe('+')
      .pipe(
        timeout(20000),
        take(1)
      )
      .subscribe(
        resp => this.responseGetSettings(resp),
        err => this.errorResponseGetSettings()
      );

    console.log('después de subscribe');
  }

  responseGetSettings(resp: string): void {
    console.log('response get settings: ', resp);
    this.loadingService.loading.dismiss();

    const stringJSON = resp.slice(0, resp.length - 1);
    let dataSettings;
    try {
      dataSettings = JSON.parse(stringJSON);
    } catch (err) {
      console.log('error convirtiendo a json');
      this.errorResponseGetSettings();
      return;
    }
    console.log('dataSettings: ', dataSettings);

    this.dashboardService.setRequestDataSettings(dataSettings);
    this.ngZone.run(() => this.router.navigate(['/settings']));
  }

  errorResponseGetSettings(): void {
    console.log('error response');
    this.loadingService.loading.dismiss();

    this.openModalInfo(
      'Error Comunicación',
      'No se pudo obtener las configuraciones del dispositivo',
      true
    );

    this.getDataDashboard();
  }


  async closeDashboard(): Promise<void> {
    const [error, response] = await this.bluetoothService.disconnect();
    console.log('gotoconnect: ', error, response);
    if (this.role === 10 || this.role === 5) {
      if (
        (this.client.orden === 'corte' && this.infoDashboard.estado === 'habilitado') ||
        (this.client.orden === 'conexion' && this.infoDashboard.estado === 'suspendido')
      ) {
        this.modalConfirmation.openModal('¿Deseas Salir?', 'El estado del dispositivo no coindice con la orden de la plataforma');
      } else {
        this.goToJobList();
      }
    } else {
      this.goToConnect();
    }
  }

  async goToJobList(): Promise<void> {
    const [error, response] = await this.bluetoothService.disconnect();
    console.log('gotoconnect: ', error, response);
    this.router.navigate(['/job-list']);
  }

  async goToConnect(): Promise<void> {
    const [error, response] = await this.bluetoothService.disconnect();
    console.log('gotoconnect: ', error, response);
    this.router.navigate(['/connect-bluetooth']);
  }

  openModalInfo(title: string, description: string, isError: boolean): void {
    this.modalInfo.openModal(title, description, isError);
  }

  ngOnDestroy(): void {
    this.isOpenConfig = false;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async ionViewDidLeave(): Promise<void> {
    this.isClosePage = true;
    this.numErrors = 0;
    clearInterval(this.interval);
    await this.setItemDashboardOnStorage();
  }

  async setItemDashboardOnStorage() {
    if (PagesService.test && localStorage.getItem(KEY_DEVICES_MODIFIES)) {
      const devices: Array<any> = JSON.parse(localStorage.getItem(KEY_DEVICES_MODIFIES));
      const index = devices.findIndex(device => device.did === this.infoDashboard.did);
      if (index !== -1) {
        this.infoDashboard.first = devices[index].first ? false : true;
        devices[index] = this.infoDashboard;
      } else {
        devices.push(this.infoDashboard);
        this.infoDashboard.first = this.infoDashboard.first ? false : true;
      }
      localStorage.setItem(KEY_DEVICES_MODIFIES, JSON.stringify(devices));
    } else if (!PagesService.test && await this.storageService.isStorage(KEY_DEVICES_MODIFIES)) {
      const devices: Array<any> = JSON.parse(await this.storageService.getStorage(KEY_DEVICES_MODIFIES));
      const index = devices.findIndex(device => device.did === this.infoDashboard.did);
      if (index !== -1) {
        this.infoDashboard.first = devices[index].first ? false : true;
        devices[index] = this.infoDashboard;
      } else {
        this.infoDashboard.first = this.infoDashboard.first ? false : true;
        devices.push(this.infoDashboard);
      }
      await this.storageService.setStorage(KEY_DEVICES_MODIFIES, JSON.stringify(devices));
    }
    else {
      const devices = new Array();
      this.infoDashboard.first = this.infoDashboard.first ? false : true;
      devices.push(this.infoDashboard);
      if (PagesService.test) {
        localStorage.setItem(KEY_DEVICES_MODIFIES, JSON.stringify(devices));
      } else {
        await this.storageService.setStorage(KEY_DEVICES_MODIFIES, JSON.stringify(devices));
      }
    }
  }
}
