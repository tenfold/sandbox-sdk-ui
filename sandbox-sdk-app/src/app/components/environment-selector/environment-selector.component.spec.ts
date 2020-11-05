import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentSelectorComponent } from './environment-selector.component';

describe('EnvironmentSelectorComponent', () => {
  let component: EnvironmentSelectorComponent;
  let fixture: ComponentFixture<EnvironmentSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
