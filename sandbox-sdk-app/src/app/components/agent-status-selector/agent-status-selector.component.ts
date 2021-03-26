import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentStatus } from '@tenfold/web-client-sdk';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-agent-status-selector',
  templateUrl: './agent-status-selector.component.html',
  styleUrls: ['./agent-status-selector.component.scss']
})
export class AgentStatusSelectorComponent implements OnInit, OnDestroy {

  agentStatus = new FormControl();

  readonly isAuthed$ = this.connectorService.getSDKService().isAuthenticated$;
  readonly agentStatuses$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated) => !!isAuthenticated),
    switchMap(() => {
      return this.connectorService.getSDKService().agentStatus.agentStatuses$;
    }),
  );

  readonly currentAgentStatus$ =
    this.connectorService.getSDKService().agentStatus.currentAgentStatus$;

  constructor(private connectorService: ConnectorService, private snackBar: MatSnackBar) { }

  private destroySubject$ = new Subject();
  ngOnInit(): void {
    this.currentAgentStatus$.pipe(
      takeUntil(this.destroySubject$),
      tap((val: AgentStatus | undefined) => {
        this.agentStatus.setValue(val?.id);
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  async selectAgentStatus(agentStatus: AgentStatus) {
    if (!agentStatus.readOnly) {
      try {
        await this.connectorService.getSDKService().agentStatus.save(agentStatus);
        return;
      } catch (err) {
      }
    } else {
      this.snackBar.open(`This status: ${agentStatus.type} ${agentStatus.reason ? '- ' + agentStatus.reason : ''} is readonly`, 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
    const prevVal = await this.currentAgentStatus$.pipe(take(1)).toPromise();
    this.agentStatus.setValue(prevVal?.id);
  }

}
