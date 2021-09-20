import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAgentComponent } from './application-agent.component';

describe('ApplicationAgentComponent', () => {
  let component: ApplicationAgentComponent;
  let fixture: ComponentFixture<ApplicationAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
