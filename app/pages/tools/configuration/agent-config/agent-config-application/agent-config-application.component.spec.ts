import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConfigApplicationComponent } from './agent-config-application.component';

describe('AgentConfigApplicationComponent', () => {
  let component: AgentConfigApplicationComponent;
  let fixture: ComponentFixture<AgentConfigApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentConfigApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConfigApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
