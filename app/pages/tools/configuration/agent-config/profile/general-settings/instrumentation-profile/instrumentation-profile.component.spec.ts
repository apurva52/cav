import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentationProfileComponent } from './instrumentation-profile.component';

describe('InstrumentationProfileComponent', () => {
  let component: InstrumentationProfileComponent;
  let fixture: ComponentFixture<InstrumentationProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentationProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
