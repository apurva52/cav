import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbDeploymentComponent } from './db-deployment.component';

describe('CavDbDeploymentComponent', () => {
  let component: DbDeploymentComponent;
  let fixture: ComponentFixture<DbDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
