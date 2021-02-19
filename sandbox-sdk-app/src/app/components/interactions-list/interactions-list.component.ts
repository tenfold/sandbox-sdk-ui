import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallControl } from '@tenfold/web-client-sdk';
import { combineLatest, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-interactions-list',
  templateUrl: './interactions-list.component.html',
  styleUrls: ['./interactions-list.component.scss']
})
export class InteractionsListComponent implements OnInit, OnDestroy {

  constructor(
    private connectorService: ConnectorService,
    private snackBar: MatSnackBar,
  ) { }

  readonly interactions$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().interaction.interactions$.pipe(
      map((interactions) => interactions.sort((a, b) => b.startTime - a.startTime)),
    )),
  );

  readonly statusChange$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().interaction.interactionStatusChange$),
  );

  readonly newInteraction$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().interaction.newInteraction$),
  );

  private newInteractionSub = new Subscription();
  private statusChangeSub = new Subscription();
  private capabilitiesSub = new Subscription();
  ngOnInit(): void {
    this.statusChangeSub = this.statusChange$.pipe(
      tap((agentStatus: any) => {
        this.snackBar.open(`Interaction #${agentStatus.id} status changed to: ${agentStatus.status}`, 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }),
    ).subscribe();

    this.newInteractionSub = this.newInteraction$.pipe(
      tap((newInteraction) => {
        console.log(`New Interaction is here: #${newInteraction.id}`);
        this.snackBar.open(`New Interaction is here: #${newInteraction.id}`, 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }),
    ).subscribe();

    const sdkFeatures = this.connectorService.getSDKService().features;

    this.capabilitiesSub = combineLatest([
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Answer),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.BlindTransfer),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.CallRecording),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Conference),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Dial),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.SendDtmf),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Hangup),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Hold),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Mute),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.Switch),
      sdkFeatures.onIntegrationCapabilitySupport(CallControl.WarmTransfer),
    ]).subscribe((val: any) => {
      console.log('[answer, blindTransfer, callRecording, conference, dial, sendDtmf, hangup, hold, mute, switch, warmTransfer]', val);
    });
  }

  ngOnDestroy() {
    this.statusChangeSub.unsubscribe();
    this.newInteractionSub.unsubscribe();
    this.capabilitiesSub.unsubscribe();
  }
}
