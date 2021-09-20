import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmVendersComponent } from './nsm-venders.component';

describe('NsmVendersComponent', () => {
  let component: NsmVendersComponent;
  let fixture: ComponentFixture<NsmVendersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmVendersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmVendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
