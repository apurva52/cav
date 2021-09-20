import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdSettingComponent } from './nd-setting.component';

describe('NdSettingComponent', () => {
  let component: NdSettingComponent;
  let fixture: ComponentFixture<NdSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
