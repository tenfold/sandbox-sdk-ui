import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sandbox-sdk-app';

  private _viewDestroyed$ = new BehaviorSubject(false);
  viewDestroyed$ = this._viewDestroyed$.asObservable();

  ngOnInit() { }

  ngOnDestroy() { }

  toggleMainView() {
    this._viewDestroyed$.next(!this._viewDestroyed$.value);
  }
}
