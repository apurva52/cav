import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowAdvSettingsComponent } from './window-adv-settings.component';

describe('WindowAdvSettingsComponent', () => {
  let component: WindowAdvSettingsComponent;
  let fixture: ComponentFixture<WindowAdvSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowAdvSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowAdvSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
