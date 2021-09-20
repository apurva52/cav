import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonGcpComponent } from './cav-mon-gcp.component';

describe('CavMonGcpComponent', () => {
  let component: CavMonGcpComponent;
  let fixture: ComponentFixture<CavMonGcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonGcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonGcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
