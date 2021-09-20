import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSettingInformationComponent } from './node-setting-information.component';

describe('NodeSettingInformationComponent', () => {
  let component: NodeSettingInformationComponent;
  let fixture: ComponentFixture<NodeSettingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSettingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSettingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
