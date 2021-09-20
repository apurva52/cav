import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineConfigurationComponent } from './machine-configuration.component';

describe('MachineConfigurationComponent', () => {
  let component: MachineConfigurationComponent;
  let fixture: ComponentFixture<MachineConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
