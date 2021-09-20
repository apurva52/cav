import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeActionSidebarComponent } from './node-action-sidebar.component';

describe('NodeActionSidebarComponent', () => {
  let component: NodeActionSidebarComponent;
  let fixture: ComponentFixture<NodeActionSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeActionSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeActionSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
