import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentDirectoryItem, Interaction, TransferAgent } from '@tenfold/web-client-sdk';
import { DirectoryEntryType } from '@tenfold/tenfold-types';
import { last } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';
interface DirectoryHistoryEntry {
  label: string;
  path: string;
}
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

  private dirHistory: DirectoryHistoryEntry[] = [];
  // private nextItem?: DirectoryHistoryEntry;

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

  private async selectAgent(result: AgentDirectoryItem) {
    const transferAgent = {
      name: result.label,
      agentStatus: result?.data?.state,
      dialOptions: result.dialOptions,
      hasPrimaryExtension: false,
    } as TransferAgent;

    await this.connectorService.getSDKService().transfers.setAgent(this.interaction.id, transferAgent);
  }

  private goNext(item: AgentDirectoryItem) {
    if (item && item.childrenPath) {
      const entry = {
        label: item.label,
        path: item.childrenPath,
      };
      this.dirHistory.push(entry);
      // this.nextItem = entry;
      this.directoryConfig.fetchPath$.next(item.childrenPath);
    }
  }

  get previousDir() {
    return last(this.dirHistory);
  }

  goPrev() {
    this.dirHistory.pop();
    const previousDir = this.previousDir;
    // this.nextItem = previousDir ? previousDir : null;
    this.directoryConfig.fetchPath$.next(previousDir ? previousDir.path : '');
  }

  async itemClicked(result: AgentDirectoryItem) {
    if (result.type === DirectoryEntryType.Skill || result.type === DirectoryEntryType.Agent) {
      this.selectAgent(result);
    } else {
      this.goNext(result);
    }
  }
}
