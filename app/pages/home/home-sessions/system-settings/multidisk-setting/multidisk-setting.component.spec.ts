import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultidiskSettingComponent } from './multidisk-setting.component';

describe('MultidiskSettingComponent', () => {
  let component: MultidiskSettingComponent;
  let fixture: ComponentFixture<MultidiskSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultidiskSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultidiskSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
