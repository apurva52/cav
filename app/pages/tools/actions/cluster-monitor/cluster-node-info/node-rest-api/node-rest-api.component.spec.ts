import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRestApiComponent } from './node-rest-api.component';

describe('NodeRestApiComponent', () => {
  let component: NodeRestApiComponent;
  let fixture: ComponentFixture<NodeRestApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeRestApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeRestApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
