import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import { Permission } from 'src/app/data/entities/permission.enum';
import { UserModel } from 'src/app/domain/models/user.model';

interface NavItem {
  title: string;
  url?: string;
  visible: boolean;
}

interface NavSection {
  header: string;
  items: Array<NavItem>;
  visible: boolean;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers:[]
})
export class NavComponent {
  menuSections$!: Observable<Array<NavSection>>;

  constructor() {
  }

  
}
