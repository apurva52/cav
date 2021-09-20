import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitStatisticsComponent } from './wait-statistics.component';

describe('WaitStatisticsComponent', () => {
  let component: WaitStatisticsComponent;
  let fixture: ComponentFixture<WaitStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
