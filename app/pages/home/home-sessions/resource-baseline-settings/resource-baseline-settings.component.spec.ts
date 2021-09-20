import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceBaselineSettingsComponent } from './resource-baseline-settings.component';

describe('ResourceBaselineSettingsComponent', () => {
  let component: ResourceBaselineSettingsComponent;
  let fixture: ComponentFixture<ResourceBaselineSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceBaselineSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceBaselineSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

