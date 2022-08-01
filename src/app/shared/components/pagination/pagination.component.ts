import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() lengthList: number;
  @Input() cantItemsShow: number;
  @Input() cantPagination: number;
  @Input() page: number;
  @Output() changePage = new EventEmitter<number>();
  maxPortion: number;
  listItems: Array<number> = [];
  isExact: boolean;
  orientation: boolean;
  portion = 1;

  constructor() { }

  ngOnInit() {
    this.setItemsPagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lengthList) {
      this.setItemsPagination();
    }
  }

  setItemsPagination(): void {
    if (this.lengthList % this.cantItemsShow === 0) {
      this.listItems.length = this.lengthList / this.cantItemsShow;
      this.listItems.fill(0);
    } else {
      this.listItems.length = Math.floor(this.lengthList / this.cantItemsShow + 1);
      this.listItems.fill(0);
    }
    this.listItems = this.listItems.map((item: any, index: number) => index + 1);
    this.maxPortion = Math.ceil(this.listItems.length / this.cantPagination);
  }

  changePortionPagination(orientation: boolean): void {
    if (orientation && this.portion < this.maxPortion + (this.isExact ? 0 : 1)) {
      this.portion += 1;
    } else if (!orientation && this.portion > 1) {
      this.portion -= 1;
    }
    this.changePage.emit(((this.portion - 1) * this.cantPagination) + 1);
  }

  onChangePage(pos: number) {
    this.changePage.emit((pos + 1) + ((this.portion - 1) * this.cantPagination));
  }

}
