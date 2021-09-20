import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConfigHomeComponent } from './agent-config-home.component';

describe('AgentConfigHomeComponent', () => {
  let component: AgentConfigHomeComponent;
  let fixture: ComponentFixture<AgentConfigHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentConfigHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConfigHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
