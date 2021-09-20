import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogIntegrationComponent } from './log-integration.component';

describe('LogIntegrationComponent', () => {
  let component: LogIntegrationComponent;
  let fixture: ComponentFixture<LogIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
