import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@tenfold/web-client-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConnectorService } from './services/connector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sandbox-sdk-app';

  constructor(private connectorService: ConnectorService) { }

  readonly isReady$ = this.connectorService.getSDKService().isReady$;
  readonly isAuthed$ = this.connectorService.getSDKService().isAuthenticated$;

  readonly userAndPhoneSystem$ = this.isAuthed$.pipe(
    switchMap((isAuthed) => {
      if (!isAuthed) {
        return of(undefined);
      } else {
        return combineLatest([
          this.connectorService.getSDKService().auth.user$,
          this.connectorService.getSDKService().auth.phoneSystem$,
        ]).pipe(
          map(([user, phoneSystem]) => ({ user, phoneSystem })),
        )
      }
    }),
  ) as Observable<{ user: User, phoneSystem: string | null } | undefined>;

  ngOnInit() { }

  ngOnDestroy() { }

  async logout() {
    await this.connectorService.getSDKService().auth.logout();
  }
}
