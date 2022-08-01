export interface Credentials {
  email?: string;
  password: string;
  ssid: string;
  orden: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  email_verified_at: Date;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: Date;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updated_at: Date;
  avatar: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  role_id: number;
  settings: any[];
  identificacion: string;
  celular: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  tipo_id: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sponsor_id?: any;
}

export interface ResponseToken {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  access_token: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  token_type: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  expires_in: number;
}
