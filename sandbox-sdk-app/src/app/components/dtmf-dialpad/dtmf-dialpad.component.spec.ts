import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtmfDialpadComponent } from './dtmf-dialpad.component';

describe('DtmfDialpadComponent', () => {
  let component: DtmfDialpadComponent;
  let fixture: ComponentFixture<DtmfDialpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtmfDialpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtmfDialpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
