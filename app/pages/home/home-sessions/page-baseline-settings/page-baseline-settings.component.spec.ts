import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBaselineSettingsComponent } from './page-baseline-settings.component';

describe('PageBaselineSettingsComponent', () => {
  let component: PageBaselineSettingsComponent;
  let fixture: ComponentFixture<PageBaselineSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBaselineSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBaselineSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

