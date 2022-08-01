import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rounded'
})
export class RoundedPipe implements PipeTransform {

  transform(value: number, fractionDigits: number): string {
    return value === 0 ? '0' : value.toFixed(fractionDigits);
  }

}
