import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByCustomDataComponent } from './group-by-custom-data.component';

describe('GroupByCustomDataComponent', () => {
  let component: GroupByCustomDataComponent;
  let fixture: ComponentFixture<GroupByCustomDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupByCustomDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupByCustomDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
