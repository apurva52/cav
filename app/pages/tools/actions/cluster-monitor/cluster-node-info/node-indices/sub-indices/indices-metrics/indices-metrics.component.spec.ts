import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesMetricsComponent } from './indices-metrics.component';

describe('IndicesMetricsComponent', () => {
  let component: IndicesMetricsComponent;
  let fixture: ComponentFixture<IndicesMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
