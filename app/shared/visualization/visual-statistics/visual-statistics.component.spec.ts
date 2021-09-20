import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualStatisticsComponent } from './visual-statistics.component';

describe('VisualStatisticsComponent', () => {
  let component: VisualStatisticsComponent;
  let fixture: ComponentFixture<VisualStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
