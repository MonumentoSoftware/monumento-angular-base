import { Pipe, PipeTransform } from '@angular/core';
import { Status } from 'src/app/domain/models/status.model';

@Pipe({
  name: 'statusLabel',
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    switch (value) {
      case Status.ACTIVE:
        return 'Ativo';
      case Status.DISABLED:
        return 'Desativado';
      case Status.DRAFT:
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  }
}
