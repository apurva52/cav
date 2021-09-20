import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentationSettingsComponent } from './instrumentation-settings.component';

describe('InstrumentationSettingsComponent', () => {
  let component: InstrumentationSettingsComponent;
  let fixture: ComponentFixture<InstrumentationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
