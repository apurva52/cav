import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedDerivedMetricesComponent } from './grouped-derived-metrices.component';

describe('GroupedDerivedMetricesComponent', () => {
  let component: GroupedDerivedMetricesComponent;
  let fixture: ComponentFixture<GroupedDerivedMetricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedDerivedMetricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedDerivedMetricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
