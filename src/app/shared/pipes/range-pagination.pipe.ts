import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rangePagination'
})
export class RangePaginationPipe implements PipeTransform {

  transform(lengthList: number, page: number, cantItemsShow: number): string {
    let range;
    if (lengthList === 0) {
      range = `0 a 0 de 0`;
    } else {
      range = `
        ${((page - 1) * cantItemsShow) + 1}
        a
        ${(((page - 1) * cantItemsShow) + cantItemsShow) > lengthList ? lengthList : ((page - 1) * cantItemsShow) + cantItemsShow}
        de
        ${lengthList}
      `;
    }
    return range;
  }

}
