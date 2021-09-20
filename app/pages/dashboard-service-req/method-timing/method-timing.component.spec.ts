import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodTimingComponent } from './method-timing.component';

describe('MethodTimingComponent', () => {
  let component: MethodTimingComponent;
  let fixture: ComponentFixture<MethodTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
