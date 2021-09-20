import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OracleTierComponent } from './oracle-tier.component';

describe('OracleTierComponent', () => {
  let component: OracleTierComponent;
  let fixture: ComponentFixture<OracleTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OracleTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OracleTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
