import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmxDeploymentComponent } from './jmx-deployment.component';

describe('JmxDeploymentComponent', () => {
  let component: JmxDeploymentComponent;
  let fixture: ComponentFixture<JmxDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmxDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmxDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
