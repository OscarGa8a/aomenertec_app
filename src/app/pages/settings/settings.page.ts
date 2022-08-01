import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { take, timeout } from 'rxjs/operators';
import { DashboardService } from '@shared/services/dashboard.service';
import { toFormControl } from '@shared/utils/forms';
import { ModalInfoComponent } from '../../shared/components/modal-info/modal-info.component';
import { BluetoothService } from '../../shared/services/bluetooth.service';
import { LoadingService } from '@app/shared/services/loading.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @ViewChild(ModalInfoComponent) modalInfo: ModalInfoComponent;

  configDevice: any;

  settingsForm: FormGroup;

  toControl = toFormControl;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private bluetoothService: BluetoothService,
    private loadingService: LoadingService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.getConfigDevice();
  }

  async getConfigDevice(): Promise<void> {
    this.configDevice = this.dashboardService.getRequestDataSettings();
    this.createForm();
  }

  createForm(): void {
    console.log(this.configDevice);
    const commonFilters = {};
    this.configDevice.forEach(itemConfig => {
      commonFilters[itemConfig.key] = this.fb.control(itemConfig.value);
    });

    this.settingsForm = this.fb.group({...commonFilters});
  }

  async setConfig(): Promise<void> {
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

    await this.loadingService.createLoading('Configurando el dispositivo...');
    console.log(this.settingsForm.getRawValue());

    const command = `conf${JSON.stringify(this.settingsForm.getRawValue())}+`;
    console.log(command);

    [error, response] = await this.bluetoothService.write(command);

    console.log('write set: ', error, response);

    console.log('antes de subscribe');

    this.bluetoothService.subscribe('+')
      .pipe(
        timeout(20000),
        take(1)
      )
      .subscribe(
        resp => this.responseSetSettings(resp),
        err => this.errorResponseSetSettings()
      );

    console.log('después de subscribe');
  }

  responseSetSettings(resp: string): void {
    console.log('response set settings: ', resp);
    this.loadingService.loading.dismiss();

    const stringJSON = resp.slice(0, resp.length - 1);
    let dataSettings;
    try {
      dataSettings = JSON.parse(stringJSON);
    } catch(err) {
      console.log('error convirtiendo a json');
      this.errorResponseSetSettings();
      return;
    }
    console.log('dataSettings: ', dataSettings);

    if (dataSettings && dataSettings.status === 'ok') {
      this.modalInfo.openModal(
        'Configuracion Exitosa',
        'Envio exitoso de configuración al dispositivo',
        false
      );
      this.ngZone.run(() => this.router.navigate(['/dashboard']));
    } else {
      this.errorResponseSetSettings();
    }
  }

  errorResponseSetSettings(): void {
    console.log('error response');
    if (this.loadingService.loading.dismiss()) {
      this.loadingService.loading.dismiss();
    }

    this.openModalInfo(
      'Error Comunicación',
      'No se pudo configurar el dispositivo',
      true
    );
  }

  openModalInfo(title: string, description: string, isError: boolean): void {
    this.modalInfo.openModal(title, description, isError);
  }
}
