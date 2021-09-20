import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMakerComponent } from './profile-maker.component';

describe('ProfileMakerComponent', () => {
  let component: ProfileMakerComponent;
  let fixture: ComponentFixture<ProfileMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
