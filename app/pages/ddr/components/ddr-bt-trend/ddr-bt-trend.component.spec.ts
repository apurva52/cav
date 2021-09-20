import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrBtTrendComponent } from './ddr-bt-trend.component';

describe('DdrBtTrendComponent', () => {
  let component: DdrBtTrendComponent;
  let fixture: ComponentFixture<DdrBtTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrBtTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrBtTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
