import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SQLActivityComponent } from './sql-activity.component';

describe('SQLActivityComponent', () => {
  let component: SQLActivityComponent;
  let fixture: ComponentFixture<SQLActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SQLActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SQLActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
