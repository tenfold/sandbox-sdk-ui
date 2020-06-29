import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Connector } from 'test-sdk-ui-integration';
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
  connector = new Connector({
    iframeDivId: 'some-sdk-custom-id',
  });

  isReady = false;

  ngOnInit() {
    this.connector.isReady$.subscribe((isReady: boolean) => {
      console.log('[app log] isReady in app: ', isReady);

      if (!!isReady) {
        this.subscriptionUser = this.connector.auth.user$.subscribe((user) => {
          console.log('[app log] user: ', user);
        });

        this.subscriptionPhoneSystem = this.connector.auth.phoneSystem$.subscribe(
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
      this.connector.auth.logout();
    } else {
      alert('is not ready!');
    }
  }

  login(event: MouseEvent) {
    event.preventDefault();
    if (this.isReady) {
      this.connector.auth
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
