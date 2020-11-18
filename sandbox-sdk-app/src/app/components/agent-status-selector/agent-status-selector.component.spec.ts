import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatusSelectorComponent } from './agent-status-selector.component';

describe('AgentStatusSelectorComponent', () => {
  let component: AgentStatusSelectorComponent;
  let fixture: ComponentFixture<AgentStatusSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentStatusSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentStatusSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
