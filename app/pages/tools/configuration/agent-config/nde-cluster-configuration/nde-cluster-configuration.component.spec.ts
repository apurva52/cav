import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeClusterConfigurationComponent } from './nde-cluster-configuration.component';

describe('NdeClusterConfigurationComponent', () => {
  let component: NdeClusterConfigurationComponent;
  let fixture: ComponentFixture<NdeClusterConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdeClusterConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdeClusterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
