import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomConfigurationComponent } from './add-custom-configuration.component';

describe('AddCustomConfigurationComponent', () => {
  let component: AddCustomConfigurationComponent;
  let fixture: ComponentFixture<AddCustomConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
