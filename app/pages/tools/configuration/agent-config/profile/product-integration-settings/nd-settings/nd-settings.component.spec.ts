import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdSettingsComponent } from './nd-settings.component';

describe('NdSettingsComponent', () => {
  let component: NdSettingsComponent;
  let fixture: ComponentFixture<NdSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
