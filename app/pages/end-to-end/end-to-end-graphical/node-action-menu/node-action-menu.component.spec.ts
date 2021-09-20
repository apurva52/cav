import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeActionMenuComponent } from './node-action-menu.component';

describe('NodeActionMenuComponent', () => {
  let component: NodeActionMenuComponent;
  let fixture: ComponentFixture<NodeActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeActionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
