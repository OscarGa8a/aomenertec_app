// import { API_URL } from '@env/environment';

/**
 * Connection EndPoint
 * Los endpoints son las URLs de una API que responden a una petición.
 * En este caso la petición está relacionada con la autenticación de los dispositivos
 */
 export class ConnectionEndpoint {
  /**
   * Endpoint que apunta al endpoint de autenticacion del dispositivo
   */
  static authenticateDevice = `assets/data/devices.json`;
}
