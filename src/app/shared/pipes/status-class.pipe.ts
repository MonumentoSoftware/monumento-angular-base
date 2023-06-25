import { Pipe, PipeTransform } from '@angular/core';
import { Status } from 'src/app/domain/models/status.model';

@Pipe({
  name: 'statusClass',
})
export class StatusClassPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    switch (value) {
      case Status.ACTIVE:
        return 'success';
      case Status.DISABLED:
        return 'danger';
      case Status.DRAFT:
        return 'medium';
      default:
        return 'medium';
    }
  }
}
