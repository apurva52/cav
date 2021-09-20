import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UxAgentSettingComponent } from './ux-agent-setting.component';

describe('UxAgentSettingComponent', () => {
  let component: UxAgentSettingComponent;
  let fixture: ComponentFixture<UxAgentSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UxAgentSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxAgentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
