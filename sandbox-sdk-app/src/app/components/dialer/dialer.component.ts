import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss']
})
export class DialerComponent implements OnInit {
  form: FormGroup;

  constructor(
    private connectorService: ConnectorService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  dial() {
    const phoneNumber = this.form.get('phoneNumber').value;
    console.log('dial!', phoneNumber);
    this.connectorService.getSDKService().callControls.dial(
      phoneNumber,
      'dialer',
      { type: 'external' },
    );

  }

}
