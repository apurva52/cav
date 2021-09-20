import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeEditSettingsComponent } from './node-edit-settings.component';

describe('NodeEditSettingsComponent', () => {
  let component: NodeEditSettingsComponent;
  let fixture: ComponentFixture<NodeEditSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeEditSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeEditSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
