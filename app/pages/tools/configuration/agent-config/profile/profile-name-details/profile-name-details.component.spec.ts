import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNameDetailsComponent } from './profile-name-details.component';

describe('ProfileNameDetailsComponent', () => {
  let component: ProfileNameDetailsComponent;
  let fixture: ComponentFixture<ProfileNameDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileNameDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileNameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
