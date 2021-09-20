import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsSettingsComponent } from './metrics-settings.component';

describe('MetricsSettingsComponent', () => {
  let component: MetricsSettingsComponent;
  let fixture: ComponentFixture<MetricsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
