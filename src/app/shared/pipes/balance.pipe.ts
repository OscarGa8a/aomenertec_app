import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balance'
})
export class BalancePipe implements PipeTransform {

  transform(balance: any): number {
    if (!balance) {
      return 0;
    }

    if (balance.tipoConsumo === 0) {
      return 0;
    } else if (balance.tipoConsumo === 1) {
      return balance.subsidio;
    } else if (balance.tipoConsumo === 2) {
      return balance.saldo;
    } else {
      return balance.credito;
    }
  }

}
