import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupCleanupComponent } from './backup-cleanup.component';

describe('BackupCleanupComponent', () => {
  let component: BackupCleanupComponent;
  let fixture: ComponentFixture<BackupCleanupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupCleanupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupCleanupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
