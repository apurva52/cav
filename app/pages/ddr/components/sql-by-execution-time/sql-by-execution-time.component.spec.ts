import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlByExecutionTimeComponent } from './sql-by-execution-time.component';

describe('SqlByExecutionTimeComponent', () => {
  let component: SqlByExecutionTimeComponent;
  let fixture: ComponentFixture<SqlByExecutionTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlByExecutionTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlByExecutionTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
