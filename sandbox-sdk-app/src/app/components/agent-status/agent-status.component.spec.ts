import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatusComponent } from './agent-status.component';

describe('AgentStatusComponent', () => {
  let component: AgentStatusComponent;
  let fixture: ComponentFixture<AgentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
