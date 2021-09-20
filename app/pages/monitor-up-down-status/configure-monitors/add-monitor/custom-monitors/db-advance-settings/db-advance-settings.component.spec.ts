import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbAdvanceSettingsComponent } from './db-advance-settings.component';

describe('DbAdvanceSettingsComponent', () => {
  let component: DbAdvanceSettingsComponent;
  let fixture: ComponentFixture<DbAdvanceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbAdvanceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbAdvanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
