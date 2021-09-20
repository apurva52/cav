import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLayoutJacketComponent } from './workspace-layout-jacket.component';

describe('WorkspaceLayoutJacketComponent', () => {
  let component: WorkspaceLayoutJacketComponent;
  let fixture: ComponentFixture<WorkspaceLayoutJacketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLayoutJacketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceLayoutJacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
