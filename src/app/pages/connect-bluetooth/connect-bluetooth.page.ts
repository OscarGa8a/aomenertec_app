import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalInfoComponent } from '@app/shared/components/modal-info/modal-info.component';
import { DashboardService } from '@shared/services/dashboard.service';
import { LoadingService } from '@shared/services/loading.service';
import { AuthenticateService } from '@shared/services/authenticate.service';
import { take, timeout } from 'rxjs/operators';
import { from } from 'rxjs';
import { BluetoothService } from '@shared/services/bluetooth.service';
import { HandleBluetoothService } from '@app/shared/services/handle-bluetooth.service';

@Component({
  selector: 'app-connect-bluetooth',
  templateUrl: './connect-bluetooth.page.html',
  styleUrls: ['./connect-bluetooth.page.scss'],
})
export class ConnectBluetoothPage implements OnInit {

  @ViewChild(ModalInfoComponent) modalInfo: ModalInfoComponent;

  formConnect: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private authenticateService: AuthenticateService,
    private bluetoothService: BluetoothService,
    private handleBluetoothService: HandleBluetoothService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.formConnect = this.fb.group({
      macAddress: ['', Validators.required]
    });
  }

  get macNotValid(): boolean {
    return this.formConnect.get('macAddress').invalid && this.formConnect.get('macAddress').touched;
  }

  onVerifyConnection(): void {
    const credentials = this.formConnect.getRawValue();
    if (this.formConnect.invalid) {
      Object.values(this.formConnect.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    else {
      console.log(credentials);
      this.getConnectedBluetooth(credentials.macAddress);
    }
  }

  async getConnectedBluetooth(macAddress: string): Promise<void> {
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
    from(this.bluetoothService.connect(macAddress))
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
        err => this.errorResponse()
      );

    console.log('después de subscribe');
  }

  errorResponse(): void {
    console.log('error response');

    this.openModalInfo(
      'Error de comunicación',
      'No se pudo obtener la información del dispositivo',
      true
    );

    this.loadingService.loading.dismiss();
  }

  responseDataDashboard(resp: string): void {
    this.loadingService.loading.dismiss();

    const stringJSON = resp.slice(0, resp.length - 1);
    let data;
    try {
      data = JSON.parse(stringJSON);
    } catch(err) {
      console.log('error convirtiendo a json');
      this.errorResponse();
      return;
    }
    console.log(data);

    this.dashboardService.setRequestDataDashboard(data);

    this.ngZone.run(() => this.goToDashboard());
  }


  openModalInfo(title: string, description: string, isError: boolean): void {
    this.modalInfo.openModal(title, description, isError);
  }

  goToDashboard(): void {
    this.authenticateService.setUserLogin(null);

    this.openModalInfo(
      'Conexión exitosa',
      `Se conecto al dispositivo`,
      false
    );

    this.router.navigate(['/dashboard']);
  }
}
