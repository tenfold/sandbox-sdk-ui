import { Component } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';


@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.scss']
})
export class CallHistoryComponent {
    constructor(private connectorService: ConnectorService) { }

    readonly isAuthed$ = this.connectorService.getSDKService().isAuthenticated$;

    readonly history$ = this.isAuthed$.pipe(
      switchMap((isAuthed) => {
        if (isAuthed) {
          return this.connectorService.getSDKService().history.fullHistory$;
        } else {
          return of([]);
        }
      }),
    );
}
