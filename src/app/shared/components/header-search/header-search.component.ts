import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
})
export class HeaderSearchComponent {
  searchFocus = false;

  constructor(private menuController: MenuController, private router: Router) {}

  async openMenu() {
    await this.menuController.enable(true, 'custom');
    await this.menuController.open('custom');
  }

  async openFilters() {
    await this.router.navigate(['/filters']);
  }

  onSearchFocus() {
    this.searchFocus = true;
  }

  onSearchBlur() {
    this.searchFocus = false;
  }
}
