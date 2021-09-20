import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavAdvanceSettingsComponent } from './cav-advance-settings.component';

describe('CavAdvanceSettingsComponent', () => {
  let component: CavAdvanceSettingsComponent;
  let fixture: ComponentFixture<CavAdvanceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavAdvanceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavAdvanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
