import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeQueryComponent } from './node-query.component';

describe('NodeQueryComponent', () => {
  let component: NodeQueryComponent;
  let fixture: ComponentFixture<NodeQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
