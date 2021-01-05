import { Component, Input, OnInit } from '@angular/core';
import { Interaction, isCall } from '@tenfold/web-client-sdk';
import { filter, switchMap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit {

  @Input() interaction: Interaction;

  readonly callControlsEnabled$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().callControls.callControlsEnabled$),
  );

  constructor(private connectorService: ConnectorService) { }

  ngOnInit(): void {
  }

  answer(interaction: Interaction) {
    if (isCall(interaction)) {
      this.connectorService.getSDKService().callControls.answerCall(interaction);
    }
  }

  hangup(interaction: Interaction) {
    if (isCall(interaction)) {
      this.connectorService.getSDKService().callControls.hangupCall(interaction);
    }
  }

  hold(interaction: Interaction) {
    if (isCall(interaction)) {
      this.connectorService.getSDKService().callControls.holdCall(interaction);
    }
  }

  mute(interaction: Interaction) {
    if (isCall(interaction)) {
      this.connectorService.getSDKService().callControls.muteCall(interaction);
    }
  }

  retrieve(interaction: Interaction) {
    if (isCall(interaction)) {
      this.connectorService.getSDKService().callControls.retrieveCall(interaction);
    }
  }

  unmute(interaction: Interaction) {
    if (isCall(interaction)) {
      this.connectorService.getSDKService().callControls.unmuteCall(interaction);
    }
  }

}
