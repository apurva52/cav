import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitConfigurationComponent } from './git-configuration.component';

describe('GitConfigurationComponent', () => {
  let component: GitConfigurationComponent;
  let fixture: ComponentFixture<GitConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
