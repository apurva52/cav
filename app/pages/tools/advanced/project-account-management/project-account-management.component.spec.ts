import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAccountManagementComponent } from './project-account-management.component';

describe('ProjectAccountManagementComponent', () => {
  let component: ProjectAccountManagementComponent;
  let fixture: ComponentFixture<ProjectAccountManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAccountManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAccountManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
