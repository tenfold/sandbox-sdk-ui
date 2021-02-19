import { Component, OnDestroy, OnInit } from '@angular/core';
import { Interaction } from '@tenfold/web-client-sdk';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';
import { objDiff } from 'src/app/utils/obj-diff';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit, OnDestroy {

  constructor(private connectorService: ConnectorService) { }

  private logsInner$ = new BehaviorSubject<{ title: string, timestamp: Date, diff?: string }[]>([]);
  readonly logs$ = this.logsInner$.asObservable();

  readonly interactionChange$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().interaction.interactionChange$),
  );

  private interactionsMap$ = new BehaviorSubject<{ [key: string]: Interaction }>({});
  private interactionChangeSub = new Subscription();
  ngOnInit(): void {
    this.interactionChangeSub = this.interactionChange$.pipe(
      tap((changedInteraction: Interaction) => {
        if (this.interactionsMap$.value[changedInteraction.id]) {
          const diffObj = objDiff(changedInteraction, this.interactionsMap$.value[changedInteraction.id]);
          this.prependLog({ title: `Interaction #${changedInteraction.id} changed`, diff: `${JSON.stringify(diffObj, null, '\t')}` });
        } else {
          this.prependLog({ title: `New Interaction #${changedInteraction.id}` });
        }

        this.interactionsMap$.next({
          ...this.interactionsMap$.value,
          [changedInteraction.id]: changedInteraction,
        });
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.interactionChangeSub.unsubscribe();
  }

  private prependLog(log: { title: string, diff?: string }) {
    this.logsInner$.next([{ ...log, timestamp: new Date() }, ...this.logsInner$.value]);
  }

}
