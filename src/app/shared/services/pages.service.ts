import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  static test = false;
  isOnline = true;

  constructor() { }

  async handleConnectionInternet(isOnline: boolean): Promise<void> {
    this.isOnline = isOnline;
    if (!this.isOnline) {
    }
  }
}
