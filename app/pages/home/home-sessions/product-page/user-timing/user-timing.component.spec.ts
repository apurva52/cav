import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTimingComponent } from './user-timing.component';

describe('UserTimingComponent', () => {
  let component: UserTimingComponent;
  let fixture: ComponentFixture<UserTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
