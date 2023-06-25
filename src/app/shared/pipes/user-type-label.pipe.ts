import { Pipe, PipeTransform } from '@angular/core';
import { UserType } from 'src/app/data/entities/user-type.enum';

@Pipe({
  name: 'userTypeLabel',
})
export class UserTypeLabelPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    switch (value) {
      case UserType.ADMIN:
        return 'Administrador';
      default:
        return 'Desconhecido';
    }
  }
}
