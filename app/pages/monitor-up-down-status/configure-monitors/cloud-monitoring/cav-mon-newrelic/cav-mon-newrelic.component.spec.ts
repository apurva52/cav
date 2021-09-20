import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonNewrelicComponent } from './cav-mon-newrelic.component';

describe('CavMonNewrelicComponent', () => {
  let component: CavMonNewrelicComponent;
  let fixture: ComponentFixture<CavMonNewrelicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonNewrelicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonNewrelicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
