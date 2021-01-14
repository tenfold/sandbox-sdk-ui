import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentDirectoryItem, Interaction, TransferAgent } from '@tenfold/web-client-sdk';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-agent-directory',
  templateUrl: './agent-directory.component.html',
  styleUrls: ['./agent-directory.component.scss']
})
export class AgentDirectoryComponent implements OnInit, OnDestroy {

  @Input() interaction: Interaction;
  form: FormGroup;

  directoryConfig = this.connectorService.getSDKService().agentDirectory.fetchAgentDirectory('');
  private destroySubject$ = new Subject();

  constructor(
    private connectorService: ConnectorService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      searchAgent: [''],
    });

    this.form.valueChanges.pipe(
      takeUntil(this.destroySubject$),
      map((formValues) => formValues.searchAgent),
      debounceTime(250),
    ).subscribe((searchAgent) => {
      console.log('searchAgent', searchAgent);
      this.directoryConfig.search$.next(searchAgent);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  trackByIndex(index: number) {
    return index;
  }

  async selectAgent(result: AgentDirectoryItem) {
    console.log('selectAgent', result);
    if (result.type === 'skill' || result.type === 'agent') {
      const transferAgent = {
        name: result.label,
        agentStatus: result?.data?.state,
        dialOptions: result.dialOptions,
        hasPrimaryExtension: false,
      } as TransferAgent;

      await this.connectorService.getSDKService().transfers.setAgent(this.interaction.id, transferAgent);
    }
  }
}
