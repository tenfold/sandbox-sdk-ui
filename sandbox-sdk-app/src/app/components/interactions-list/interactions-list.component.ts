import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-interactions-list',
  templateUrl: './interactions-list.component.html',
  styleUrls: ['./interactions-list.component.scss']
})
export class InteractionsListComponent implements OnInit {

  constructor(
    private connectorService: ConnectorService,
    private snackBar: MatSnackBar,
  ) { }

  readonly interactions$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().interaction.interactions$.pipe(
      tap((interactions) => console.log('interactions', interactions)),
    )),
  );

  readonly statusChange$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().interaction.interactionStatusChange$.pipe(
      tap((interactionStatus) => console.log('interactionStatus', interactionStatus)),
    )),
  );


  private statusChangeSub = new Subscription();
  ngOnInit(): void {
    this.statusChangeSub = this.statusChange$.pipe(
      tap((agentStatus) => {
        this.snackBar.open(`Interaction #${agentStatus.id} status changed to: ${agentStatus.status}`, 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.statusChangeSub.unsubscribe();
  }


}
