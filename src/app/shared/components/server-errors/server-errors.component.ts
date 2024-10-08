import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-server-errors',
  templateUrl: './server-errors.component.html',
  styleUrls: ['./server-errors.component.scss'],
})
export class ServerErrorsComponent {
  @Input() errors!: Array<string>;

  constructor() {}
}
