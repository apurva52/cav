import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonDynatraceComponent } from './cav-mon-dynatrace.component';

describe('CavMonDynatraceComponent', () => {
  let component: CavMonDynatraceComponent;
  let fixture: ComponentFixture<CavMonDynatraceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonDynatraceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonDynatraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
