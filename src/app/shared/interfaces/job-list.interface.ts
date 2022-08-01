export interface ItemList {
  id: number;
  order: string;
  orden: string;
  client: string;
  address: string;
  nombre: string;
  direccion: string;
}

export interface UserClient {
  uid: string;
  did: string;
  ssid: string;
  password: string;
  nombre: string;
  direccion: any;
  departamento: string;
  municipio: string;
  ubicacion: string;
  latitud: string;
  longitud: string;
  celular: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fecha_lectura: string;
  estado: string;
  orden: string;
  pass: string;
  id: number;
  reviewed: boolean;
  nearbyNetworks: boolean;
}
