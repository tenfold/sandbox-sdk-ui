import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionsListComponent } from './interactions-list.component';

describe('InteractionsListComponent', () => {
  let component: InteractionsListComponent;
  let fixture: ComponentFixture<InteractionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
