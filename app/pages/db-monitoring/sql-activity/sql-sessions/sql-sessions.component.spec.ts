import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlSessionsComponent } from './sql-sessions.component';

describe('SqlSessionsComponent', () => {
  let component: SqlSessionsComponent;
  let fixture: ComponentFixture<SqlSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
