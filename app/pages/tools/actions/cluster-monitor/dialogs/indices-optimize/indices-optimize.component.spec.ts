import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesOptimizeComponent } from './indices-optimize.component';

describe('IndicesOptimizeComponent', () => {
  let component: IndicesOptimizeComponent;
  let fixture: ComponentFixture<IndicesOptimizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesOptimizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesOptimizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
