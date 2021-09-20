import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VMsStatusComponent } from './vms-status.component';

describe('VMsStatusComponent', () => {
  let component: VMsStatusComponent;
  let fixture: ComponentFixture<VMsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VMsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VMsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
