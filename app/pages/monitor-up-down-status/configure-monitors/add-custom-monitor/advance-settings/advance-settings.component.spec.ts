import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSettingsComponent } from './advance-settings.component';

describe('CavAdvanceSettingsComponent', () => {
  let component: AdvanceSettingsComponent;
  let fixture: ComponentFixture<AdvanceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
