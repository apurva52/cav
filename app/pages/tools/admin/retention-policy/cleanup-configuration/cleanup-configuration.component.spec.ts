import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanupConfigurationComponent } from './cleanup-configuration.component';

describe('CleanupConfigurationComponent', () => {
  let component: CleanupConfigurationComponent;
  let fixture: ComponentFixture<CleanupConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanupConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanupConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
