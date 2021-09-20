import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionClassesComponent } from './detection-classes.component';

describe('DetectionClassesComponent', () => {
  let component: DetectionClassesComponent;
  let fixture: ComponentFixture<DetectionClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectionClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectionClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
