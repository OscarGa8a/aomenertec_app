import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import to from 'await-to-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private nativeStorage: NativeStorage) { }

  async isStorage(key: string): Promise<boolean> {
    const value = await this.getStorage(key);
    return !!value;
  }

  async setStorage(key: string, value: string): Promise<void> {
    const [error, response] = await to(this.nativeStorage.setItem(key, value));
  }

  async getStorage(key: string): Promise<any> {
    const [error, response] = await to(this.nativeStorage.getItem(key));
    return response;
  }

  async clear(): Promise<void>{
    await this.nativeStorage.clear();
  }

  async removeStorage(key: string): Promise<void> {
    await this.nativeStorage.remove(key);
  }
}
