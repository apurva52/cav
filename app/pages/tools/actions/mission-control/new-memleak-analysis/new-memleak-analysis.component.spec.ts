import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemleakAnalysisComponent } from './new-memleak-analysis.component';

describe('NewMemleakAnalysisComponent', () => {
  let component: NewMemleakAnalysisComponent;
  let fixture: ComponentFixture<NewMemleakAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMemleakAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemleakAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
