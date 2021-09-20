import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeIndicesComponent } from './node-indices.component';

describe('NodeIndicesComponent', () => {
  let component: NodeIndicesComponent;
  let fixture: ComponentFixture<NodeIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
