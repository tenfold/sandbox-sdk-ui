import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { WebClient as TenfoldWebClient } from '@tenfold/web-client-sdk';
import { PASSWORD } from './password';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sandbox-sdk-app';

  subscriptionUser: Subscription;
  subscriptionPhoneSystem: Subscription;
  webClient = new TenfoldWebClient({
    iframeDivId: 'some-sdk-custom-id',
  });

  isReady = false;

  ngOnInit() {
    this.webClient.isReady$.subscribe((isReady: boolean) => {
      console.log('[app log] isReady in app: ', isReady);

      if (!!isReady) {
        this.subscriptionUser = this.webClient.auth.user$.subscribe((user) => {
          console.log('[app log] user: ', user);
        });

        this.subscriptionPhoneSystem = this.webClient.auth.phoneSystem$.subscribe(
          (phoneSystem) => {
            console.log('[app log] phoneSystem: ', phoneSystem);
          }
        );
      }
      this.isReady = isReady;
    });
  }

  ngOnDestroy() {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }

    if (this.subscriptionPhoneSystem) {
      this.subscriptionPhoneSystem.unsubscribe();
    }
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    if (this.isReady) {
      this.webClient.auth.logout();
    } else {
      alert('is not ready!');
    }
  }

  login(event: MouseEvent) {
    event.preventDefault();
    if (this.isReady) {
      this.webClient.auth
        .login({
          username: 'pawel.paulinski+dev@tenfold.com',
          password: `${PASSWORD}`,
        })
        .then(() => {
          console.log('[app log] Successfully loggedIn');
        })
        .catch((err) => {
          console.log('[app log] Error, not loggedIn', err.message);
        });
    } else {
      alert('is not ready!');
    }
  }
}
