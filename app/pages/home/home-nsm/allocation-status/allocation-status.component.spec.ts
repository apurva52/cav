import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationStatusComponent } from './allocation-status.component';

describe('AllocationStatusComponent', () => {
  let component: AllocationStatusComponent;
  let fixture: ComponentFixture<AllocationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
