import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReportsFilterComponent } from './general-reports-filter.component';

describe('GeneralReportsFilterComponent', () => {
  let component: GeneralReportsFilterComponent;
  let fixture: ComponentFixture<GeneralReportsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralReportsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralReportsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
