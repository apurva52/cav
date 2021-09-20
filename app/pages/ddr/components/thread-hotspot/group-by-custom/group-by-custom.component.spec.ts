import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByCustomComponent } from './group-by-custom.component';

describe('GroupByCustomComponent', () => {
  let component: GroupByCustomComponent;
  let fixture: ComponentFixture<GroupByCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupByCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupByCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
