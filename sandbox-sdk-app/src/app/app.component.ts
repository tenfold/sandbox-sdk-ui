import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sandbox-sdk-app';

  private viewDestroyedInner$ = new BehaviorSubject(false);
  viewDestroyed$ = this.viewDestroyedInner$.asObservable();

  ngOnInit() { }

  ngOnDestroy() { }

  toggleMainView() {
    this.viewDestroyedInner$.next(!this.viewDestroyedInner$.value);
  }
}
