import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallAttachment, Interaction } from '@tenfold/web-client-sdk';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-attachment-setter',
  templateUrl: './attachment-setter.component.html',
  styleUrls: ['./attachment-setter.component.scss']
})
export class AttachmentSetterComponent implements OnInit {

  @Input() interaction: Interaction;
  form: FormGroup;

  constructor(
    private connectorService: ConnectorService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      url: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('submit attachment', this.form.value);
    const url = this.form.value?.url;
    if (!!url) {
      const attachment = {
        type: 'url',
        url,
      } as CallAttachment;
      this.connectorService.getSDKService().transfers.setAttachment(
        this.interaction.id, attachment);
    }
  }
}
