import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGraphInTreeComponent } from './show-graph-in-tree.component';

describe('ShowGraphInTreeComponent', () => {
  let component: ShowGraphInTreeComponent;
  let fixture: ComponentFixture<ShowGraphInTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGraphInTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGraphInTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
