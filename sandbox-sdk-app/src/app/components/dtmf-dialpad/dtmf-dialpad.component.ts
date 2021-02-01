import { Component, Input, OnInit } from '@angular/core';
import { isCall, Interaction } from '@tenfold/web-client-sdk';
import { BehaviorSubject } from 'rxjs';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-dtmf-dialpad',
  templateUrl: './dtmf-dialpad.component.html',
  styleUrls: ['./dtmf-dialpad.component.scss']
})
export class DtmfDialpadComponent implements OnInit {

  @Input() interaction: Interaction;

  private showDialpadSubject$ = new BehaviorSubject(false);
  readonly showDialpad$ = this.showDialpadSubject$.asObservable();

  public numbers: string[] = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#',
  ];

  constructor(private connectorService: ConnectorService) { }

  ngOnInit(): void {
  }

  toggleShowDialpad() {
    this.showDialpadSubject$.next(!this.showDialpadSubject$.value);
  }

  async buttonClicked(char: string) {
    console.log('dtmf button clicked', char);
    if (isCall(this.interaction)) {
      await this.connectorService.getSDKService().callControls.sendDtmf(
        this.interaction, char);
    }
  }

}
