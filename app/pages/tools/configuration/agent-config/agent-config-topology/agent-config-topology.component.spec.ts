import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConfigTopologyComponent } from './agent-config-topology.component';

describe('AgentConfigTopologyComponent', () => {
  let component: AgentConfigTopologyComponent;
  let fixture: ComponentFixture<AgentConfigTopologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentConfigTopologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConfigTopologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
