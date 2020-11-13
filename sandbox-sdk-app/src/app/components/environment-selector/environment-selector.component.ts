import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { tap, take, takeUntil } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';

const PRODUCTION_API = 'https://api.tenfold.com';
const DEVELOPMENT_API = 'https://api-development.tenfold.com';
const CANARY_API = 'https://api-canary.tenfold.com';

@Component({
  selector: 'app-environment-selector',
  templateUrl: './environment-selector.component.html',
  styleUrls: ['./environment-selector.component.scss']
})
export class EnvironmentSelectorComponent implements OnInit, OnDestroy {

  environment = new FormControl();
  environmentList: string[] = [
    PRODUCTION_API,
    DEVELOPMENT_API,
    CANARY_API,
  ];

  constructor(private connectorService: ConnectorService) { }

  readonly currentEnvironment$ =
    this.connectorService.getSDKService().env.currentEnvironment$;

  readonly isAuthed$ = this.connectorService.getSDKService().isAuthenticated$;

  private destroySubject$ = new Subject();
  ngOnInit(): void {
    this.currentEnvironment$.pipe(
      takeUntil(this.destroySubject$),
      tap((val) => {
        this.environment.setValue(val.environmentUrl);
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  async selectEnv(env: string) {
    try {
      await this.connectorService.getSDKService().env.setEnvironment({ environmentUrl: env });
    } catch (err) {
      const prevVal = await this.currentEnvironment$.pipe(take(1)).toPromise();
      this.environment.setValue(prevVal.environmentUrl);
    }
  }

}
