import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisualizationComponent } from './create-visualization.component';

describe('CreateVisualizationComponent', () => {
  let component: CreateVisualizationComponent;
  let fixture: ComponentFixture<CreateVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
