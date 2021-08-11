import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CallHistoryComponent } from './call-history.component';

describe('CallHistoryComponent', () => {
  let component: CallHistoryComponent;
  let fixture: ComponentFixture<CallHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
