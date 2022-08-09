import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { NetworkService } from './shared/services/network.service';
import { PagesService } from './shared/services/pages.service';
import { KEY_JOBLIST_STORAGE } from '@shared/utils/constants';
import { Router } from '@angular/router';
import { StorageService } from '@shared/services/storage.service';
import { KEY_IS_FIRST, KEY_DEVICES_MODIFIES, KEY_USER_LOGGED } from './shared/utils/constants';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private screenOrientation: ScreenOrientation,
    private networkService: NetworkService,
    private pagesService: PagesService,
    private router: Router,
    private storageService: StorageService,
    private platform: Platform
  ) { }

  ngOnInit(): void {
    this.isFirst();

    this.initializeApp();

    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    // this.networkService.getNetworkStatus().subscribe(isOnline => {
    //   this.pagesService.handleConnectionInternet(isOnline);
    // });
  }

  async isFirst(): Promise<void> {
    if (!localStorage.getItem(KEY_IS_FIRST)) {
      if (PagesService.test) {
        localStorage.removeItem(KEY_JOBLIST_STORAGE);
        localStorage.removeItem(KEY_DEVICES_MODIFIES);
        localStorage.removeItem(KEY_USER_LOGGED);
      } else {
        if (await this.storageService.isStorage(KEY_JOBLIST_STORAGE)) {
          await this.storageService.removeStorage(KEY_JOBLIST_STORAGE);
        }
        if (await this.storageService.isStorage(KEY_DEVICES_MODIFIES)) {
          await this.storageService.removeStorage(KEY_DEVICES_MODIFIES);
        }
        if (await this.storageService.isStorage(KEY_USER_LOGGED)) {
          await this.storageService.removeStorage(KEY_USER_LOGGED);
        }
      }
      localStorage.setItem(KEY_IS_FIRST, 'true');
    }

    this.validateJobList();
  }

  async validateJobList(): Promise<void> {
    if (PagesService.test && localStorage.getItem(KEY_JOBLIST_STORAGE)) {
      this.router.navigate(['/job-list']);
    } else if (!PagesService.test && await this.storageService.isStorage(KEY_JOBLIST_STORAGE)) {
      this.router.navigate(['/job-list']);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', (event) => {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
    });
  }
}


// https://aoym-enertec-app.vercel.app/login
// android:usesCleartextTraffic="true"
