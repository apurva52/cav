import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionInterfacesComponent } from './detection-interfaces.component';

describe('DetectionInterfacesComponent', () => {
  let component: DetectionInterfacesComponent;
  let fixture: ComponentFixture<DetectionInterfacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectionInterfacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectionInterfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
