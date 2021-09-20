import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternMatchingComponent } from './pattern-matching.component';

describe('PatternMatchingComponent', () => {
  let component: PatternMatchingComponent;
  let fixture: ComponentFixture<PatternMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
