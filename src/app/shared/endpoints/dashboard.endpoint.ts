import { ESP_URL } from '@env/environment';

/**
 * Dashboard EndPoint
 * Los endpoints son las URLs de una API que responden a una petición.
 * En este caso la petición está relacionada con las peticiones en la dashboard
 */
 export class DashboardEndpoint {
  /** Endpoint que apunta al endpoint de data de dashboard */
  static dataDashboard = `${ESP_URL}dashboard`;

  /** Endpoint que apunta al endpoint de data de dashboard */
  static stateDevice = `${ESP_URL}estado`;

  /** Endpoint que apunta al endpoint de data de dashboard */
  static rechargeDevice = `${ESP_URL}recarga`;

  /** Endpoint que apunta al endpoint de data de dashboard */
  static configDevice = `${ESP_URL}config`;
}
