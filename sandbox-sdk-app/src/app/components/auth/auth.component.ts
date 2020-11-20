import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectorService } from 'src/app/services/connector.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private connectorService: ConnectorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;

  ngOnInit(): void {
  }

  async onSubmit() {
    if (!this.formSubmitAttempt) {
      this.loginInvalid = false;
      this.formSubmitAttempt = false;
      if (this.form.valid) {
        try {
          const username = this.form.get('username').value;
          const password = this.form.get('password').value;
          await this.connectorService.getSDKService().auth.login({
            username, password
          });
        } catch (err) {
          this.loginInvalid = true;
          this.snackBar.open('Invalid credentials!', 'OK', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      } else {
        this.formSubmitAttempt = true;
      }
    }
  }
}
