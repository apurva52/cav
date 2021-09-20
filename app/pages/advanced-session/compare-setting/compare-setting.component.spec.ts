import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareSettingComponent } from './compare-setting.component';

describe('CompareSettingComponent', () => {
  let component: CompareSettingComponent;
  let fixture: ComponentFixture<CompareSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
