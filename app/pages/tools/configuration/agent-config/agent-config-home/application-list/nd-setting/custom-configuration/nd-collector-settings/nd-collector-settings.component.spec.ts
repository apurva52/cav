import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdCollectorSettingsComponent } from './nd-collector-settings.component';

describe('NdCollectorSettingsComponent', () => {
  let component: NdCollectorSettingsComponent;
  let fixture: ComponentFixture<NdCollectorSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdCollectorSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdCollectorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
