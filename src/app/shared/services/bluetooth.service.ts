import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import to from 'await-to-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor(private bluetoothSerial: BluetoothSerial) {}

  // Conéctese a un dispositivo Bluetooth.
  // connect(macAddress: string): Promise<any> {
  //   return to(this.bluetoothSerial.connect(macAddress).toPromise());
  // }

  // Conéctese a un dispositivo Bluetooth.
  connect(macAddress: string): Promise<any> {
    return this.bluetoothSerial.connect(macAddress).toPromise();
  }

  // Conéctese de manera insegura a un dispositivo Bluetooth.
  connectInsecure(macAddress: string): Promise<any> {
    return to(this.bluetoothSerial.connectInsecure(macAddress).toPromise());
  }

  // Desconectar
  disconnect(): Promise<any> {
    return to(this.bluetoothSerial.disconnect());
  }

  // Escribe datos en el puerto serie.
  write(text: string): Promise<any> {
    return to(this.bluetoothSerial.write(text));
  }

  // Obtiene el número de bytes de datos disponibles
  available(): Promise<any> {
    return to(this.bluetoothSerial.available());
  }

  // Lee datos del búfer.
  read(): Promise<any> {
    return to(this.bluetoothSerial.read());
  }

  // Lee datos del búfer hasta que alcanza un delimitador.
  readUntil(text: string): Promise<any> {
    return this.bluetoothSerial.readUntil(text);
  }

  // Suscríbete para ser notificado cuando se reciban los datos
  subscribe(text: string): Observable<any> {
    return this.bluetoothSerial.subscribe(text);
  }

  // Suscríbete para ser notificado cuando se reciban los datos.
  subscribeRawData(): Observable<any> {
    return this.bluetoothSerial.subscribeRawData();
  }

  // Borra los datos en el búfer.
  clear(): Promise<any> {
    return to(this.bluetoothSerial.clear());
  }

  // Enumera los dispositivos enlazados
  list(): Promise<any> {
    return to(this.bluetoothSerial.list());
  }

  // Informa del estado de la conexión.
  isConnected(): Promise<any> {
    return to(this.bluetoothSerial.isConnected());
  }

  // Informa si el bluetooth está habilitado.
  isEnabled(): Promise<any> {
    return to(this.bluetoothSerial.isEnabled());
  }

  // Muestra la configuración de Bluetooth en el dispositivo.
  showBluetoothSettings(): Promise<any> {
    return to(this.bluetoothSerial.showBluetoothSettings());
  }

  // Habilite Bluetooth en el dispositivo.
  enable(): Promise<any> {
    return to(this.bluetoothSerial.enable());
  }

  // Descubrir dispositivos no emparejados
  discoverUnpaired(): Promise<any> {
    return to(this.bluetoothSerial.discoverUnpaired());
  }

  // Registre una función de devolución de llamada de notificación para que se llame
  // durante el descubrimiento del dispositivo bluetooth. Para que la devolución de llamada funcione,
  // el proceso de descubrimiento debe iniciarse con discoverUnpaired . Solo puede haber
  // una devolución de llamada registrada.
  setDeviceDiscoveredListener(): Observable<any> {
    return this.bluetoothSerial.setDeviceDiscoveredListener();
  }

  // Establece el nombre del dispositivo legible por humanos que se transmite a otros dispositivos.
  setName(name: string): void {
    this.bluetoothSerial.setName(name);
  }

  // Hace que el dispositivo sea detectable por otros dispositivos.
  setDiscoverable(duration: number): void {
    this.bluetoothSerial.setDiscoverable(duration);
  }
}
