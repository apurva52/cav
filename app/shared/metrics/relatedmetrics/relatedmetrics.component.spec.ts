import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedmetricsComponent } from './relatedmetrics.component';

describe('RelatedmetricsComponent', () => {
  let component: RelatedmetricsComponent;
  let fixture: ComponentFixture<RelatedmetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedmetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedmetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
