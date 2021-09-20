import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentileComponent } from './percentile.component';

describe('PercentileComponent', () => {
  let component: PercentileComponent;
  let fixture: ComponentFixture<PercentileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
