import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { LoginService } from '../api/login.service';
import { CredentialResponse } from 'google-one-tap';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-register-modal',
  templateUrl: './login-register-modal.component.html',
  styleUrls: ['./login-register-modal.component.scss'],
  providers: [LoginService],
})
export class LoginRegisterModalComponent implements OnInit {
  constructor(
    private ngZone: NgZone,
    private loginService: LoginService,
    private modalcontroller: ModalController,
  ) {}

  ngOnInit() {
    // @ts-ignore
    google.accounts?.id?.initialize({
      client_id: environment.oauthKey,
      ux_mode: 'popup',
      cancel_on_tap_outside: true,
      // Setting the callback
      callback: (res: CredentialResponse) => {
        this.ngZone.run(() => {
          this.loginService.continueWithGoogle(res.credential);
        });
      },
    });

    // check if the google button is already rendered
    // @ts-ignore
    google.accounts?.id?.renderButton(
      document.getElementById('gbtn') as HTMLElement,
      {
        size: 'large',
        shape: 'pill',
        theme: 'filled_black',
        locale: 'pt-BR',
      },
    );
  }

  cancel() {
    return this.modalcontroller.dismiss(null, 'cancel');
  }
}
