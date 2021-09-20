import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbQueryLogsComponent } from './db-query-logs.component';

describe('DbQueryLogsComponent', () => {
  let component: DbQueryLogsComponent;
  let fixture: ComponentFixture<DbQueryLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbQueryLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbQueryLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
