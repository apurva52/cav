import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LDAPServerSettingComponent } from './ldap-server-setting.component';

describe('LDAPServerSettingComponent', () => {
  let component: LDAPServerSettingComponent;
  let fixture: ComponentFixture<LDAPServerSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LDAPServerSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LDAPServerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
