import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoInstrumentComponent } from './auto-instrument.component';

describe('AutoInstrumentComponent', () => {
  let component: AutoInstrumentComponent;
  let fixture: ComponentFixture<AutoInstrumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoInstrumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoInstrumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
