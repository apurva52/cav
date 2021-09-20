import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineAgentComponent } from './machine-agent.component';

describe('MachineAgentComponent', () => {
  let component: MachineAgentComponent;
  let fixture: ComponentFixture<MachineAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
