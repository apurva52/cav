import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CCsVPsStatusComponent } from './ccs-vps-status.component';

describe('CCsVPsStatusComponent', () => {
  let component: CCsVPsStatusComponent;
  let fixture: ComponentFixture<CCsVPsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CCsVPsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCsVPsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
