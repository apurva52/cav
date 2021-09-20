import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSegmentCrudComponent } from './user-segment-crud.component';

describe('UserSegmentCrudComponent', () => {
  let component: UserSegmentCrudComponent;
  let fixture: ComponentFixture<UserSegmentCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSegmentCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSegmentCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
