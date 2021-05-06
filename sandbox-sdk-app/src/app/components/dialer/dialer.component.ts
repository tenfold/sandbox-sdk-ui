import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      phoneNumber: ['', Validators.required],
      pbxSkillId: ['', []],
    });
  }

  ngOnInit(): void {
  }

  async dial() {
    const phoneNumber = this.form.get('phoneNumber').value;
    const skillId = this.form.get('pbxSkillId').value || undefined;
    console.log('dial!', phoneNumber);
    try {
      await this.connectorService.getSDKService().callControls.dial(
        phoneNumber,
        'dialer',
        { type: 'external', skillId },
      );
    } catch (err) {
      console.log('dial err: ', err);
      this.snackBar.open(`Dial error: ${err.message}`, 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }

  }

}
