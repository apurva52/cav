import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillDownDbQueriesComponent } from './drilldown-db-queries.component';

describe('DbQueriesComponent', () => {
  let component: DrillDownDbQueriesComponent;
  let fixture: ComponentFixture<DrillDownDbQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillDownDbQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillDownDbQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
