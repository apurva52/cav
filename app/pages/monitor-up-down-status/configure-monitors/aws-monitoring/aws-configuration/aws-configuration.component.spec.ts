import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsConfigurationComponent } from './aws-configuration.component';

describe('AwsConfigurationComponent', () => {
  let component: AwsConfigurationComponent;
  let fixture: ComponentFixture<AwsConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
