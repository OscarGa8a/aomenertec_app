import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WifiWizard2 } from '@ionic-native/wifi-wizard-2/ngx';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    // {
    //   provide: RouteReuseStrategy,
    //   useClass: IonicRouteStrategy,
    // },
    WifiWizard2,
    ScreenOrientation,
    Network,
    NativeStorage,
    BluetoothSerial
    // HTTP
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}

// Pruebas cuenta compartida
