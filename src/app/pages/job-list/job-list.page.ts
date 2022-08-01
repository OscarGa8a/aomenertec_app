import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { JobListService } from '@shared/services/job-list.service';
import { UserClient } from '@shared/interfaces/job-list.interface';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from '@shared/services/loading.service';
import to from 'await-to-js';
import { ModalInfoComponent } from '@app/shared/components/modal-info/modal-info.component';
import { DashboardService } from '@shared/services/dashboard.service';
import { StorageService } from '@shared/services/storage.service';
import { KEY_DEVICES_MODIFIES, KEY_JOBLIST_STORAGE } from '@shared/utils/constants';
import { ConnectionService } from '@shared/services/connection.service';
import { from } from 'rxjs';
import { PagesService } from '@shared/services/pages.service';
import { KEY_USER_LOGGED } from '@shared/utils/constants';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { BluetoothService } from '@app/shared/services/bluetooth.service';
import { take, timeout } from 'rxjs/operators';
import { HandleBluetoothService } from '@app/shared/services/handle-bluetooth.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.page.html',
  styleUrls: ['./job-list.page.scss'],
})
export class JobListPage implements OnInit {

  @ViewChild('table') table: ElementRef;

  @ViewChild(ModalInfoComponent) modalInfo: ModalInfoComponent;

  @ViewChild(ModalConfirmationComponent) modalConfirmation: ModalConfirmationComponent;

  isLogout: boolean;

  jobList: Array<UserClient> = [];

  jobListFiltered: Array<UserClient> = [];

  words: Array<string>;

  page = 1;

  cantItemsShow: number;

  searchControl: FormControl;

  title = 'Tabla d*e trabajo';

  reviewedDevices = new Array<any>();

  disabledButtonReload = true;

  constructor(
    private jobListService: JobListService,
    private router: Router,
    private loadingService: LoadingService,
    private dashboardService: DashboardService,
    private storageService: StorageService,
    private connectionService: ConnectionService,
    private bluetoothService: BluetoothService,
    private handleBluetoothService: HandleBluetoothService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    console.log('on init job-list');
    this.words = this.title.split('*');
    this.createControl();
  }

  ionViewWillEnter() {
    console.log('ion view will enter job list');
    this.disabledButtonReload = true;

    setTimeout(() => this.getData(), 500);
  }

  async getData(): Promise<void> {
    if (PagesService.test) {
      console.log('is devices checked local: ', !!localStorage.getItem(KEY_DEVICES_MODIFIES));
      if (!!localStorage.getItem(KEY_DEVICES_MODIFIES)) {
        this.reviewedDevices = JSON.parse(localStorage.getItem(KEY_DEVICES_MODIFIES));
        this.disabledButtonReload = false;
        console.log('devices checked: ', this.reviewedDevices);
      }
      console.log('job list local: ', !!localStorage.getItem(KEY_JOBLIST_STORAGE));
      if (!!localStorage.getItem(KEY_JOBLIST_STORAGE)) {
        this.jobList = JSON.parse(localStorage.getItem(KEY_JOBLIST_STORAGE));
        console.log('job list local storage: ', this.jobList);
        await this.setJobList();
      } else {
        console.log('no local storage job list');
        this.getJobList();
      }
    } else {
      console.log('is devices checked storage: ', await this.storageService.isStorage(KEY_DEVICES_MODIFIES));
      if (await this.storageService.isStorage(KEY_DEVICES_MODIFIES)) {
        this.reviewedDevices = JSON.parse(await this.storageService.getStorage(KEY_DEVICES_MODIFIES));
        console.log('devices checked: ', this.reviewedDevices);
        this.disabledButtonReload = false;
      }
      console.log('job list storage: ', await this.storageService.isStorage(KEY_JOBLIST_STORAGE));
      if (await this.storageService.isStorage(KEY_JOBLIST_STORAGE)) {
        // this.jobList = await this.jobListService.getJobListStorage();
        this.jobList = JSON.parse(await this.storageService.getStorage(KEY_JOBLIST_STORAGE));
        console.log('job list storage: ', this.jobList);
        await this.setJobList();
      } else {
        console.log('no storage joblist');
        this.getJobList();
      }
    }
  }

  createControl() {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges.subscribe(value => this.onChangeSearch(value));
  }

  onChangeSearch(search: string): void {
    this.jobListFiltered = this.jobList.filter(
      item => this.removeAccentAndLower(item.nombre).includes(this.removeAccentAndLower(search))
    );
  }

  async getConnectedBluetooth(client: any): Promise<void> {
    this.connectionService.setCredentialsClient(client);

    await this.loadingService.createLoading('Conectando al dispositivo...');

    const errorBluetooth = await this.handleBluetoothService.verifyBluetooth();
    console.log(errorBluetooth);

    if (errorBluetooth === 0) {
      this.openModalInfo(
        'Bluetooth Desactivado',
        `Habilite la conexión bluetooth`,
        true
      );

      this.loadingService.loading.dismiss();
      return;
    } else if (errorBluetooth === 1) {
      this.openModalInfo(
        'Error Bluetooth',
        `Fallo la conexión Bluetooth`,
        true
      );

      this.loadingService.loading.dismiss();
      return;
    }

    console.log('antes de connect');
    console.log(client.macAddres);
    client.macAddres = '00:19:06:35:7F:27';
    from(this.bluetoothService.connect(client.macAddres))
      .pipe(
        timeout(12000),
        take(1)
      )
      .subscribe(
        resp => console.log(resp),
        err => this.responseConnect(err)
      );
  }

  responseConnect(resp: any): void {
    console.log(resp);

    this.loadingService.loading.dismiss();

    if (typeof resp === 'string') {
      if (resp.includes('is not a valid Bluetooth address')) {
        this.openModalInfo(
          'Error de conexión',
          'La dirección MAC no es válida',
          true
        );
      } else {
        this.openModalInfo(
          'Error de conexión',
          'No se pudo conectar al dispositivo',
          true
        );
      }
    } else {
      this.getDataDashboard();
    }
  }

  async getDataDashboard(): Promise<void> {
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

    await this.loadingService.createLoading('Obteniendo datos de dashboard ...');

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

    this.loadingService.loading.dismiss();

    this.ngZone.run(() => {
      this.openModalInfo(
        'Error de comunicación',
        'No se pudo obtener la información del dispositivo',
        true
      );
    });
  }

  responseDataDashboard(resp: string): void {
    console.log(resp);
    this.loadingService.loading.dismiss();

    const stringJSON = resp.slice(0, resp.length - 1);
    let data;
    try {
      data = JSON.parse(stringJSON);
    } catch(err) {
      console.log('error convirtiendo a json ', err);
      this.errorResponseDataDashboard();
      return;
    }
    console.log(data);

    this.dashboardService.setRequestDataDashboard(data);

    if (this.connectionService.getCredentialsClient().orden !== 'lectura') {
      this.setStateDevice();
    } else {
      this.ngZone.run(() => this.goToDashboard());
    }
  }

  async setStateDevice(): Promise<void> {
    const client = this.connectionService.getCredentialsClient();

    await this.loadingService.createLoading('Configurando estado...');

    console.log(`esta${client.orden === 'conexion' ? '1' : '0'}+`);

    const [error, response] =
      await this.bluetoothService.write(`esta${client.orden === 'conexion' ? '1' : '0'}+`);

    console.log('write set: ', error, response);


    this.bluetoothService.subscribe('+')
      .pipe(
        timeout(20000),
        take(1)
      )
      .subscribe(
        resp => this.responseSetSate(resp),
        err => this.errorResponseSetState()
      );
  }

  responseSetSate(resp: string): void {
    console.log(resp);
    const stringJSON = resp.slice(0, resp.length - 1);
    let dataConexion;
    try {
      dataConexion = JSON.parse(stringJSON);
    } catch(err) {
      console.log('error convirtiendo a json ', err);
      this.errorResponseSetState();
      return;
    }
    console.log('dataconexión: ', dataConexion);

    if (dataConexion.status === 'ok') {
      this.loadingService.loading.dismiss();
      const client = this.connectionService.getCredentialsClient();
      const data = this.dashboardService.getRequestDataDashboard();
      data.estado = client.orden === 'corte' ? 'suspendido' : 'habilitado';
      this.dashboardService.setRequestDataDashboard(data);

      this.ngZone.run(() => this.goToDashboard());
    } else {
      this.errorResponseSetState();
    }
  }

  errorResponseSetState(): void {
    console.log('error response');
    this.loadingService.loading.dismiss();

    this.ngZone.run(() => {
      this.openModalInfo(
        'Error Comunicación',
        'No se pudo configurar el estado del dispositivo',
        true
      );
    });
  }

  goToDashboard(): void {
    this.openModalInfo(
      'Conexión exitosa',
      `Se conecto al dispositivo`,
      false
    );

    this.router.navigate(['/dashboard']);
  }

  openModalInfo(title: string, description: string, error: boolean): void {
    this.modalInfo.openModal(title, description, error);
  }

  removeAccentAndLower(search: string): string {
    let withoutAccent = search.toLowerCase();
    withoutAccent = withoutAccent.replace('á', 'a');
    withoutAccent = withoutAccent.replace('é', 'e');
    withoutAccent = withoutAccent.replace('í', 'i');
    withoutAccent = withoutAccent.replace('ó', 'o');
    withoutAccent = withoutAccent.replace('ú', 'u');
    console.log(withoutAccent);
    return withoutAccent;
  }

  async getJobList(): Promise<void> {
    await this.loadingService.createLoading('Obteniedo lista de trabajo...');

    const [error, response] = await to(this.jobListService.getListJob2().toPromise());

    if (error) {
      this.modalInfo.openModal(
        'Error Conexión',
        'No se pudo obtener la lista de trabajo',
        true
      );

      this.router.navigate(['/login']);
    } else {
      this.jobList = response;
      console.log('job list: ', this.jobList);

      if (PagesService.test) {
        localStorage.setItem(KEY_JOBLIST_STORAGE, JSON.stringify(this.jobList));
      } else {
        await this.storageService.setStorage(KEY_JOBLIST_STORAGE, JSON.stringify(this.jobList));
      }

      await this.setJobList();
    }

    this.loadingService.loading.dismiss();
  }

  async setJobList(): Promise<void> {
    console.log('jobList: ', this.jobList);
    this.jobList.forEach(item => {
      item.reviewed = this.reviewedDevices.some(device => device.did === item.did);
    });

    console.log(this.jobList);

    this.jobListFiltered = this.jobList;

    await new Promise((r, j) => this.waitTable(r, j));
    await new Promise((r, j) => setTimeout(() => { r(true); }, 500));
    // console.log(document.querySelector('.table2').getBoundingClientRect());
    const heightTable = this.table.nativeElement.getBoundingClientRect().height;
    // -47.4px que son el alto del elemento con la clase top-table
    // -24px que son el alto del elemento con la clase head-table
    // -10 px que son el padding del contenedor de la tabla
    // -32.8 px que son el alto del elemento con la clase footer-table
    // -10 px que son el margin top agregado en el elemento con la clase footer-table
    const heightAvailable = heightTable - 47.4 - 24 - 10 - 32.8 - 10;
    this.cantItemsShow = Math.floor(heightAvailable / 31);
    // console.log(heightAvailable, this.cantItemsShow);
    console.log(heightTable);
    // this.storageService.setStorage(KEY_JOBLIST_STORAGE, JSON.stringify(this.jobList));
    // this.jobListService.setJobListStorage(this.jobList);
  }

  /** Función que espera a que los inputs del rango se rendericen en la página */
  waitTable(r: any, j: any): void {
    // Si los elementos están renderizados, resuelve la promesa
    if (this.table && this.table.nativeElement) {
      r();
    } else {
      // Si no, se vuelve a llamar la misma función (recursividad)
      setTimeout(() => this.waitTable(r, j));
    }
  }

  logout(): void {
    this.isLogout = true;
    this.modalConfirmation.openModal(
      'Cerrar Sesión',
      '¿Está seguro de cerrar sesión? Perderá todos los datos no guardados'
    );
  }

  reload(): void {
    if(!this.disabledButtonReload) {
      this.isLogout = false;
      this.modalConfirmation.openModal(
        'Cargar Datos',
        '¿Está seguro? Perderá el acceso a los dispositivos ya escaneados'
      );
    }
  }

  async onConfirmLogout(): Promise<void> {
    if (PagesService.test) {
      localStorage.removeItem(KEY_JOBLIST_STORAGE);
      localStorage.removeItem(KEY_USER_LOGGED);
      localStorage.removeItem(KEY_DEVICES_MODIFIES);
    } else {
      console.log('eliminandooooooooooooooooooooooooo');
      await this.storageService.removeStorage(KEY_JOBLIST_STORAGE);
      await this.storageService.removeStorage(KEY_USER_LOGGED);
      await this.storageService.removeStorage(KEY_DEVICES_MODIFIES);
    }
    this.router.navigate(['/login']);
  }

  async onConfirmReload(): Promise<void> {
    this.loadingService.createLoading('Actualizado datos');
    if (PagesService.test) {
      console.log('reload');
      const devices: Array<any> = JSON.parse(localStorage.getItem(KEY_DEVICES_MODIFIES));
      console.log(devices);
      // console.log(await this.jobListService.postReload(devices).toPromise());
      const [error, reponse] = await to(this.jobListService.postReload(devices).toPromise());
      console.log(error,reponse);
      if (error) {
        console.log('error Actualizando');
        // @ts-ignore
        if(error.status === 0){
          this.modalInfo.openModal(
            'Comprueba tu conexión',
            'Es necesario estar en línea, pero parece que no tienes conexión',
            true
          );
        } else {
          console.log('error Actualizando');
          this.modalInfo.openModal(
            'Error actualizando',
            'No fue posible cargar los datos de los dispositivos al servidor',
            true
          );
        }
      } else {
        console.log('Actualizado');
        // filtrar lista de trabajo
        console.log(this.jobList);
        this.jobList = this.jobList.filter(item => !item.reviewed);
        localStorage.setItem(KEY_JOBLIST_STORAGE, JSON.stringify(this.jobList));
        await this.setJobList();
        // console.log(this.jobList.filter(item => !item.reviewed));
        // eliminar dispositivos visitados
        localStorage.removeItem(KEY_DEVICES_MODIFIES);

        this.modalInfo.openModal(
          'Actualizacion completa',
          'La informacion de los dispositivos a sido cargada exitosamente al servidor',
          false
        );
      }
    } else {
      console.log('reload');
      // console.log('reassociate');
      // console.log(await to(WifiWizard2.reassociate()));
      // console.log('have connection?: ', await to(WifiWizard2.canConnectToInternet()));
      // console.log(await to(WifiWizard2.reassociate()));
      const devices: Array<any> = JSON.parse(await this.storageService.getStorage(KEY_DEVICES_MODIFIES));
      console.log(devices);

      const [error, reponse] = await to(this.jobListService.postReload(devices).toPromise());
      console.log(error,reponse);
      if (error) {
        console.log('error Actualizando');
        // @ts-ignore
        if(error.status === 0){
          this.modalInfo.openModal(
            'Comprueba tu conexión',
            'Es necesario estar en línea, pero parece que no tienes conexión',
            true
          );
        } else {
          console.log('error Actualizando');
          this.modalInfo.openModal(
            'Error actualizando',
            'No fue posible cargar los datos de los dispositivos al servidor',
            true
          );
        }
      } else {
        console.log('Actualizado');
        // filtrar lista de trabajo
        this.jobList = this.jobList.filter(item => !item.reviewed);
        await this.storageService.setStorage(KEY_JOBLIST_STORAGE, JSON.stringify(this.jobList));
        await this.setJobList();
        // eliminar dispositivos visitados
        await this.storageService.removeStorage(KEY_DEVICES_MODIFIES);
        this.modalInfo.openModal(
          'Actualizacion completa',
          'La informacion de los dispositivos a sido cargada exitosamente al servidor',
          false
        );
      }
    }

    if (this.loadingService.loading) {
      this.loadingService.loading.dismiss();
    }
  }

  ionViewDidLeave(): void {
    console.log('ion view did leave job list');
    this.jobList = new Array<any>();
    this.jobListFiltered = new Array<any>();
  }
}
