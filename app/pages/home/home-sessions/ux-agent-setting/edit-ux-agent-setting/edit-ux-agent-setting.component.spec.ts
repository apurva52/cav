import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUxAgentSettingComponent } from './edit-ux-agent-setting.component';

describe('EditUxAgentSettingComponent', () => {
  let component: EditUxAgentSettingComponent;
  let fixture: ComponentFixture<EditUxAgentSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUxAgentSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUxAgentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
