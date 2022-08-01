import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading: HTMLIonLoadingElement;

  constructor(public loadingController: LoadingController) { }

  async createLoading(message: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message,
      backdropDismiss: false,
    });

    await this.loading.present();

    // const { role, data } = await loading.onDidDismiss();
    // console.log(role, data);
    this.loading.onDidDismiss().then(() => {
      // console.log('escaneo terminado');
    });
  }
}
