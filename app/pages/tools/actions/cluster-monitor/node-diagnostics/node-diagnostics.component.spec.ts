import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDiagnosticsComponent } from './node-diagnostics.component';

describe('NodeDiagnosticsComponent', () => {
  let component: NodeDiagnosticsComponent;
  let fixture: ComponentFixture<NodeDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
