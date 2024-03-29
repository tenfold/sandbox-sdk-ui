import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Call,
  CallAttachment,
  CallControl,
  Interaction, isActive, isRinging, TransferAgent, TransferOptions, TransferStage
} from '@tenfold/web-client-sdk';
import { get, isEqual } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

type TransferMode = 'warm' | 'cold' | null;
@Component({
  selector: 'app-transfers-section',
  templateUrl: './transfers-section.component.html',
  styleUrls: ['./transfers-section.component.scss']
})
export class TransfersSectionComponent implements OnInit, OnDestroy {

  selectedTransferMode$ = new BehaviorSubject<TransferMode>(null);
  private set selectedTransferMode(val: TransferMode) {
    if (val !== this.selectedTransferMode$.value) {
      localStorage.setItem(`selectedTransferMode_${this.interaction$.value?.id}`, val);
      this.selectedTransferMode$.next(val);
    }
  }

  TransferStage = TransferStage;

  interaction$ = new BehaviorSubject<Interaction | null>(null);
  @Input() set interaction(value: Interaction | null) {
    if (this.interaction?.id !== value?.id) {
      const savedSelectedTransferMode = localStorage.getItem(`selectedTransferMode_${value?.id}`);
      if (!!savedSelectedTransferMode) {
        this.selectedTransferMode$.next(
          (savedSelectedTransferMode === 'null' ? null : savedSelectedTransferMode) as TransferMode);
      }
    }
    this.interaction$.next(value);
  }

  get interaction(): Interaction | null {
    return this.interaction$.value;
  }

  constructor(
    private connectorService: ConnectorService,
    private snackBar: MatSnackBar,
  ) {
    this.showCallControls$ = combineLatest([
      this.callControlsAllowed$,
      this.callControlsEnabled$,
    ]).pipe(map(([allowedForCall, featureEnabled]) => {
      return !!allowedForCall && !!featureEnabled;
    }));

    const checkCallForCallControls = (interaction: Interaction | null | undefined) => {
      return interaction && isActive(interaction) && !isRinging(interaction);
    };

    const isMainCallActive$ = this.interaction$.pipe(
      map(checkCallForCallControls),
    );

    const isChildCallActive$ = this.childCall$.pipe(
      map(checkCallForCallControls),
    );

    combineLatest([
      isMainCallActive$,
      isChildCallActive$,
    ]).pipe(
      takeUntil(this.destroySubject$),
      map(([mainCallActive, childCallActive]) => {
        return !!mainCallActive || !!childCallActive;
      }),
    ).subscribe(this.callControlsAllowed$);

    this.agent$.pipe(
      takeUntil(this.destroySubject$),
      tap((agent) => {
        this.agent = agent;
      }),
    ).subscribe();

    this.attachment$.pipe(
      takeUntil(this.destroySubject$),
      tap((attachment) => {
        this.attachment = attachment;
      }),
    ).subscribe();

    this.childCall$.pipe(
      takeUntil(this.destroySubject$),
      tap((internalCall) => this.internalCall = internalCall),
    ).subscribe();
  }

  private destroySubject$ = new Subject();
  private agent?: TransferAgent;
  private attachment?: CallAttachment;
  private internalCall: Call | undefined | null;
  private callControlsAllowed$ = new BehaviorSubject<boolean>(false);
  readonly callControlsEnabled$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().callControls.callControlsEnabled$),
  );

  readonly sendDtmfEnabled$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().features.onIntegrationCapabilitySupport(CallControl.SendDtmf).pipe(
      tap((sendDtmf) => console.log('sendDtmf value', sendDtmf)),
    )),
  );

  readonly transfers$ = this.connectorService.getSDKService().isAuthenticated$.pipe(
    filter((isAuthenticated: boolean) => isAuthenticated),
    switchMap(() => this.connectorService.getSDKService().transfers.transfers$),
    startWith({}),
  );

  private childCall$ = this.interactionTransferSubState$.pipe(
    map((state) => state?.internalCall),
  );

  showCallControls$: Observable<boolean>;

  blindButtonDisabled$ = combineLatest([
    this.childCall$,
    this.transferStage$,
  ]).pipe(
    map(([childCall, transferStage]) => {
      const internalCallActive = !!childCall && childCall.status !== 'Hangup';
      return internalCallActive || transferStage === TransferStage.Initial;
    }),
  );

  warmButtonDisabled$ = combineLatest([
    this.blindButtonDisabled$,
    this.isCallActionInProgress$,
  ]).pipe(
    takeUntil(this.destroySubject$),
    map(([blindButtonDisabled, isCallActionInProgress]) => {
      return blindButtonDisabled || isCallActionInProgress;
    }),
  );

  isHandoverAllowed$ = combineLatest([
    this.interaction$,
    this.journey$,
  ]).pipe(
    takeUntil(this.destroySubject$),
    map(([interaction, journey]) => {
      return (interaction as Call).meta?.callTag === 'conference' &&
        !!journey && journey.some(transfer => transfer.from.callId === interaction.id);
    })
  );

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  get agent$() {
    return this.interactionTransferSubState$.pipe(
      takeUntil(this.destroySubject$),
      map((state) => state?.agent),
      distinctUntilChanged((agent1, agent2) => isEqual(agent1, agent2)),
    );
  }

  get attachment$() {
    return this.interactionTransferSubState$.pipe(
      takeUntil(this.destroySubject$),
      map((state) => state?.attachment),
      distinctUntilChanged((attachment1, attachment2) => isEqual(attachment1, attachment2)),
    );
  }

  get interactionTransferSubState$() {
    return combineLatest([
      this.interaction$,
      this.transfers$,
    ]).pipe(
      takeUntil(this.destroySubject$),
      map(([call, transfers]) => {
        return !!call ? transfers[call.id] : ({} as any);
      }),
    );
  }

  get transferStage$() {
    return this.interactionTransferSubState$.pipe(
      startWith({ transferStage: TransferStage.Initial }),
      takeUntil(this.destroySubject$),
      map((state) => state?.transferStage || TransferStage.Initial),
      distinctUntilChanged((transferStage1, transferStage2) => transferStage1 === transferStage2),
    );
  }

  get journey$() {
    return this.interactionTransferSubState$.pipe(
      takeUntil(this.destroySubject$),
      map((state) => state?.journey),
      startWith([]),
    );
  }

  get isCallActionInProgress$() {
    return this.interactionTransferSubState$.pipe(
      takeUntil(this.destroySubject$),
      map((state) => state?.isCallActionInProgress),
    );
  }

  async blindTransfer() {
    const transferOptions = this.getTransferOptions();
    await this.connectorService.getSDKService().transfers.blindTransfer(
      this.interaction.id,
      transferOptions);
    this.selectedTransferMode = 'cold';
  }

  async warmTransfer() {
    if (!isActive(this.internalCall)) {
      const transferOptions = this.getTransferOptions();
      await this.connectorService.getSDKService().transfers.handleInternalCall(
        this.interaction.id,
        transferOptions);
      this.selectedTransferMode = 'warm';
    }
  }

  async cancelConference() {
    if (isActive(this.internalCall)) {
      await this.connectorService.getSDKService().transfers.handleInternalCall(
        this.interaction.id, {} as TransferOptions);
      this.selectedTransferMode = null;
    }
  }

  async mergeTransfer() {
    await this.connectorService.getSDKService().transfers.mergeTransfer(
      this.interaction.id);
  }

  async completeWarmTransfer() {
    await this.connectorService.getSDKService().transfers.completeWarmTransfer(
      this.interaction.id);
  }

  async handOverCall() {
    await this.connectorService.getSDKService().transfers.handOverCall(
      this.interaction.id);
  }

  async switch() {
    await this.connectorService.getSDKService().callControls.switchCall(this.interaction as Call);
  }

  // async cancelBlindTransfer() {
  //   try {
  //     await this.connectorService.getSDKService().transfers.cancelBlindTransfer(this.interaction.id);
  //   } catch (err) {
  //     this.snackBar.open(`Could not cancel blind transfer: #${this.interaction.id}`, 'OK', {
  //       duration: 5000,
  //       horizontalPosition: 'center',
  //       verticalPosition: 'bottom',
  //     });
  //   }
  // }

  private get attachments(): CallAttachment[] | undefined {
    if (this.attachment) {
      return [this.attachment];
    }
  }

  private getTransferOptions(): TransferOptions {
    const [destination, pbxOptions] = this.getTransferDestination();
    const attachments = this.attachments;

    return {
      attachments,
      destination,
      pbxOptions,
    } as TransferOptions;
  }

  get extension() {
    const extensions = get(this.agent, 'extensions', []);
    return extensions[0] || '';
  }

  private getTransferDestination() {
    let destinationNumber: string;
    let pbxOptions: any;

    const dialOptions = get(this.agent, 'dialOptions');
    if (dialOptions) {
      destinationNumber = String(get(dialOptions, 'phoneNumbers.0.number', ''));
      pbxOptions = { type: dialOptions.dialType };
    } else {
      destinationNumber = String(this.extension);
    }

    return [destinationNumber, pbxOptions];
  }
}
