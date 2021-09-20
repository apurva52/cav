import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByAllComponent } from './group-by-all.component';

describe('GroupByAllComponent', () => {
  let component: GroupByAllComponent;
  let fixture: ComponentFixture<GroupByAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupByAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupByAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
