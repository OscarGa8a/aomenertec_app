import { API_URL, BASE_URL } from '@env/environment';

/**
 * JobList EndPoint
 * Los endpoints son las URLs de una API que responden a una petición.
 * En este caso la petición está relacionada con la lista de trabajo
 */
 export class JobListEndpoint {
  /**
   * Endpoint que apunta al endpoint de autenticacion del dispositivo
   */
  static jobList = `assets/data/jobList.json`;
  static jobList2 = `${API_URL}auth/job-list`;
  static reload = `${BASE_URL}webhook/test`;
}
