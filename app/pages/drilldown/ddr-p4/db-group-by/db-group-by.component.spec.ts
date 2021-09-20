import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbGroupByComponent } from './db-group-by.component';

describe('DbQueriesComponent', () => {
  let component: DbGroupByComponent;
  let fixture: ComponentFixture<DbGroupByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbGroupByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbGroupByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
