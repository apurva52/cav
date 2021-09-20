import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdDeploymentComponent } from './cmd-deployment.component';

describe('CavCmdDeploymentComponent', () => {
  let component: CmdDeploymentComponent;
  let fixture: ComponentFixture<CmdDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
