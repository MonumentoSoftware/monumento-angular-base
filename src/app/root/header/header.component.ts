import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [],
})
export class HeaderComponent {
  public version: string = environment.version;
  @Output() toggleMenu = new EventEmitter();

  constructor() {}

  onMenuToggle() {
    this.toggleMenu.emit();
  }
}
