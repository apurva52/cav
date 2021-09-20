import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialReportsComponent } from './special-reports.component';

describe('SpecialReportsComponent', () => {
  let component: SpecialReportsComponent;
  let fixture: ComponentFixture<SpecialReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
