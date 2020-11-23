import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentSettings } from '@tenfold/web-client-sdk';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginComponent implements OnInit {

  private agentSettingsInner: AgentSettings;
  @Input() set agentSettings(val: AgentSettings) {
    this.agentSettingsInner = val;

    const prefillAgentId = this.agentSettings?.agentId;
    if (!!prefillAgentId) {
      this.form.get('agentId').setValue(prefillAgentId);
    }

    if (this.agentSettings?.hasPassword) {
      this.form.get('password').setValue('▪▪▪▪▪▪▪▪');
    }

    const prefExt = this.agentSettings?.preferredExtension;
    if (!!prefExt) {
      this.form.get('extension').setValue(prefExt);
    }
  }

  get agentSettings() {
    return this.agentSettingsInner;
  }

  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;

  constructor(
    private connectorService: ConnectorService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      agentId: ['', Validators.required],
      password: ['', Validators.required],
      extension: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  async onSubmit() {
    if (!this.formSubmitAttempt) {
      this.loginInvalid = false;
      this.formSubmitAttempt = false;
      if (this.form.valid) {
        try {
          const agentId = this.form.get('agentId').value;
          const password = this.form.get('password').value;
          const extension = this.form.get('extension').value;
          await this.connectorService.getSDKService().agentStatus.login({
            agentId, password, extension
          });
        } catch (err) {
          this.loginInvalid = true;
        }
      } else {
        this.formSubmitAttempt = true;
      }
    }
  }

  async logout() {
    await this.connectorService.getSDKService().auth.logout();
  }

}
