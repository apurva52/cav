import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelprelatedmetricsComponent } from './helprelatedmetrics.component';

describe('HelprelatedmetricsComponent', () => {
  let component: HelprelatedmetricsComponent;
  let fixture: ComponentFixture<HelprelatedmetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelprelatedmetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelprelatedmetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
