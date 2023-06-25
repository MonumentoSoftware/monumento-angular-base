import { Component } from '@angular/core';
import { AuthService } from '../auth/api/auth.service';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  constructor(private readonly authService: AuthService) {}
}
