import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisualizationSubComponent } from './create-visualization-sub.component';

describe('CreateVisualizationSubComponent', () => {
  let component: CreateVisualizationSubComponent;
  let fixture: ComponentFixture<CreateVisualizationSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVisualizationSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVisualizationSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
