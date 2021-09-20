import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbQueryStatsFilterComponent } from './db-query-stats-filter.component';

describe('DbQueryStatsFilterComponent', () => {
  let component: DbQueryStatsFilterComponent;
  let fixture: ComponentFixture<DbQueryStatsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbQueryStatsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbQueryStatsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
