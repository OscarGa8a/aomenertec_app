import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ItemList, UserClient } from '../interfaces/job-list.interface';
import { JobListEndpoint } from '../endpoints/job-list.endpoint';
import { AuthenticateService } from './authenticate.service';
import { KEY_JOBLIST_STORAGE } from '../utils/constants';
import { StorageService } from './storage.service';
import { ESP_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobListService {

  // private role = new BehaviorSubject<number>(0);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  // role$ = this.role.asObservable;

  constructor(
    private http: HttpClient,
    private authenticateService: AuthenticateService,
    private storageService: StorageService
  ) { }

  getListJob(): Observable<ItemList[]> {
    return this.http.get<ItemList[]>(JobListEndpoint.jobList);
  }

  getListJob2(): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `bearer ${this.authenticateService.getToken()}`
    });
    return this.http.post<any>(JobListEndpoint.jobList2, {}, { headers });
  }

  postReload(data: any){
    const headers = new HttpHeaders({
      authorization: `bearer ${this.authenticateService.getToken()}`
    });
    console.log(data);
    return this.http.post<any>(JobListEndpoint.reload, data, { headers });
    // return this.http.get<any>(ESP_URL);
  }

  // setRole(role: number): void {
  //   this.role.next(role);
  // }


  async setJobListStorage(jobList: UserClient[]): Promise<void> {
    await this.storageService.setStorage(KEY_JOBLIST_STORAGE, JSON.stringify(jobList));
  }

  async getJobListStorage(): Promise<UserClient[]> {
    return JSON.parse(await this.storageService.getStorage(KEY_JOBLIST_STORAGE));
  }
}
