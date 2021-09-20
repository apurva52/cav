import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DBQueryStatsComponent } from './db-query-stats.component';

describe('DBQueryStatsComponent', () => {
  let component: DBQueryStatsComponent;
  let fixture: ComponentFixture<DBQueryStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DBQueryStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DBQueryStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
