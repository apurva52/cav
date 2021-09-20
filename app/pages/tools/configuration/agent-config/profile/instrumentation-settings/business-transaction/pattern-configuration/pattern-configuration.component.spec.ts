import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternConfigurationComponent } from './pattern-configuration.component';

describe('PatternConfigurationComponent', () => {
  let component: PatternConfigurationComponent;
  let fixture: ComponentFixture<PatternConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
