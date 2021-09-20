import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSettingComponent } from './favourite-setting.component';

describe('FavouriteSettingComponent', () => {
  let component: FavouriteSettingComponent;
  let fixture: ComponentFixture<FavouriteSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
