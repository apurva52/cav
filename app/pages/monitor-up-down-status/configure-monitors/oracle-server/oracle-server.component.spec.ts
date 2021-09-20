import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OracleServerComponent } from './oracle-server.component';

describe('OracleServerComponent', () => {
  let component: OracleServerComponent;
  let fixture: ComponentFixture<OracleServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OracleServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OracleServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
