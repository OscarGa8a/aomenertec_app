import { TestBed } from '@angular/core/testing';

import { HandleBluetoothService } from './handle-bluetooth.service';

describe('HandleBluetoothService', () => {
  let service: HandleBluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleBluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
