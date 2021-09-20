import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfigurationComponent } from './custom-configuration.component';

describe('CustomConfigurationComponent', () => {
  let component: CustomConfigurationComponent;
  let fixture: ComponentFixture<CustomConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
