import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-item-setting',
  templateUrl: './item-setting.component.html',
  styleUrls: ['./item-setting.component.scss'],
})
export class ItemSettingComponent implements OnInit {

  @Input() item: any;
  @Input() form: FormControl;
  isFocus = false;

  constructor() { }

  ngOnInit() {
  }

}
