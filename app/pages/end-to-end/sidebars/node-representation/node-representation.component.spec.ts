import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRepresentationComponent } from './node-representation.component';

describe('NodeRepresentationComponent', () => {
  let component: NodeRepresentationComponent;
  let fixture: ComponentFixture<NodeRepresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeRepresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeRepresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
