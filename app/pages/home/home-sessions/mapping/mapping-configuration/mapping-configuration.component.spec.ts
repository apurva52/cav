import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingConfigurationComponent } from './mapping-configuration.component';

describe('MappingConfigurationComponent', () => {
  let component: MappingConfigurationComponent;
  let fixture: ComponentFixture<MappingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
