import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  openModalInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  openModalSetting: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

}
