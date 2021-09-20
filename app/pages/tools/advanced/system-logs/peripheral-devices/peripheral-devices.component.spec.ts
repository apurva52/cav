import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeripheralDevicesComponent } from './peripheral-devices.component';

describe('PeripheralDevicesComponent', () => {
  let component: PeripheralDevicesComponent;
  let fixture: ComponentFixture<PeripheralDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeripheralDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeripheralDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
