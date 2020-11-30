import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@tenfold/web-client-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ConnectorService } from '../services/connector.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit, OnDestroy {

  constructor(private connectorService: ConnectorService) { }

  readonly isReady$ = this.connectorService.getSDKService().isReady$;
  readonly isAuthed$ = this.connectorService.getSDKService().isAuthenticated$;

  readonly isAgentLoginRequired$ = this.isAuthed$.pipe(
    switchMap((isAuthed) => {
      if (isAuthed) {
        return this.connectorService.getSDKService().callControls.hasSessionCreation$;
      } else {
        return of(false);
      }
    }),
  );

  readonly isAgentSessionActive$ = this.isAuthed$.pipe(
    switchMap((isAuthed) => {
      if (isAuthed) {
        return this.connectorService.getSDKService().callControls.sessionActive$;
      } else {
        return of(false);
      }
    }),
  );

  readonly agentSettings$ = this.isAuthed$.pipe(
    switchMap((isAuthed) => {
      if (isAuthed) {
        return this.connectorService.getSDKService().agentStatus.getAgentSettings();
      } else {
        return of(false);
      }
    }),
  );


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
        );
      }
    }),
  ) as Observable<{ user: User, phoneSystem: string | null } | undefined>;


  ngOnInit() { }

  ngOnDestroy() {
    console.log('MAIN VIEW COMPONENT DESTROY');
    this.connectorService.destroy();
  }

  async logout() {
    const isAgentLoginRequired = await this.isAgentLoginRequired$.pipe(take(1)).toPromise();
    const sessionActive = await this.isAgentSessionActive$.pipe(take(1)).toPromise();
    if (isAgentLoginRequired && sessionActive) {
      await this.connectorService.getSDKService().callControls.destroySession();
    } else {
      await this.connectorService.getSDKService().auth.logout();
    }
  }

}
