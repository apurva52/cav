import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSegmentComponent } from './user-segment.component';

describe('UserSegmentComponent', () => {
  let component: UserSegmentComponent;
  let fixture: ComponentFixture<UserSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
