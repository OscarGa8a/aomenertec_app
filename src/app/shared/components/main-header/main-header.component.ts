import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {

  @Input() title: string;
  words: Array<string>;

  constructor() { }

  ngOnInit() {
    this.words = this.title.split(' ');
  }

}
