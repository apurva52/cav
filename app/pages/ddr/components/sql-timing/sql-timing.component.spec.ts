import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlTimingComponent } from './sql-timing.component';

describe('SqlTimingComponent', () => {
  let component: SqlTimingComponent;
  let fixture: ComponentFixture<SqlTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
