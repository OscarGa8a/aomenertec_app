import { API_URL } from '@env/environment';

/**
 * Authenticate EndPoint
 * Los endpoints son las URLs de una API que responden a una petición.
 * En este caso la petición está relacionada con la autenticación de los usuarios
 */
export class AuthenticateEndpoint {

  /** Endpoint que apunta al endpoint de autenticacion */
  static authenticateUser = `assets/data/users.json`;

  static authenticate = `${API_URL}auth/login`;

  static refresh = `${API_URL}auth/refresh`;

  static profile = `${API_URL}auth/me`;
}
