import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { EnvironmentSelectorComponent } from './components/environment-selector/environment-selector.component';
import { InteractionsListComponent } from './components/interactions-list/interactions-list.component';
import { LoggerComponent } from './components/logger/logger.component';
import { NgLetDirective } from './components/ng-let/ng-let.directive';
import { AgentStatusSelectorComponent } from './components/agent-status-selector/agent-status-selector.component';
import { AgentLoginComponent } from './components/agent-login/agent-login.component';
import { DialerComponent } from './components/dialer/dialer.component';
import { CallControlsComponent } from './components/call-controls/call-controls.component';
import { MainViewComponent } from './main-view/main-view.component';
import { AgentDirectoryComponent } from './components/agent-directory/agent-directory.component';
import { TransfersSectionComponent } from './components/transfers-section/transfers-section.component';
import { AttachmentSetterComponent } from './components/attachment-setter/attachment-setter.component';
import { DtmfDialpadComponent } from './components/dtmf-dialpad/dtmf-dialpad.component';

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentSelectorComponent,
    InteractionsListComponent,
    AuthComponent,
    NgLetDirective,
    LoggerComponent,
    AgentStatusSelectorComponent,
    AgentLoginComponent,
    DialerComponent,
    CallControlsComponent,
    MainViewComponent,
    AgentDirectoryComponent,
    TransfersSectionComponent,
    AttachmentSetterComponent,
    DtmfDialpadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
