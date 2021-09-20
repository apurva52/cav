import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDescriptionComponent } from './metric-description.component';

describe('MetricDescriptionComponent', () => {
  let component: MetricDescriptionComponent;
  let fixture: ComponentFixture<MetricDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
