import { Component, HostBinding } from '@angular/core';

/* eslint @angular-eslint/component-selector: "off"*/
@Component({
  selector: 'root',
  templateUrl: 'root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  @HostBinding('class') classList = '';
  public readonly appPages = [
    { title: 'Dashboard', url: 'dashboard', icon: 'apps' },
    { title: 'Pacientes', url: 'pacients', icon: 'body' },
    { title: 'Consultas', url: 'appoitments', icon: 'calendar' },
    { title: 'Profissioais', url: 'doctors', icon: 'medical' },
    { title: 'Clinicas', url: 'doctors', icon: 'medkit' },
  ];
  displayMenu = true;

  constructor() { }

  toggleMenu() {
    this.displayMenu = !this.displayMenu;
    this.classList = this.displayMenu ? '' : 'hide-menu';
  }
}
