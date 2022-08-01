import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private online: Observable<boolean> = null;
  private hasConnection = new Subject<boolean>();

  constructor(
    private network: Network,
    private platform: Platform,
    private http: HttpClient
  ) {

    if (this.platform.is('cordova')) {
      // on Device
      this.network.onConnect().subscribe(() => {
          this.testNetworkConnection();
          // this.hasConnection.next(true);
          return;
      });
      this.network.onDisconnect().subscribe(() => {
          this.hasConnection.next(false);
          return;
      });
    } else {
      // on Browser
      this.online = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );

      this.online.subscribe((isOnline) =>{
          if (isOnline) {
              this.testNetworkConnection();
          } else {
              this.hasConnection.next(false);
          }
      });
    }
    this.testNetworkConnection();
  }

  public getNetworkStatus(): Observable<boolean> {
    return this.hasConnection.asObservable();
  }

  private getNetworkTestRequest(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async testNetworkConnection(): Promise<any> {
    try {
        this.getNetworkTestRequest().subscribe(
        _success => {
            this.hasConnection.next(true);
            return;
        },
        _error => {
          this.hasConnection.next(false);
          return;
        });
    } catch (err) {
        this.hasConnection.next(false);
        return;
    }
  }
}
