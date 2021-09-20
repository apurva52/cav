import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTreeSettingComponent } from './graph-tree-setting.component';

describe('GraphTreeSettingComponent', () => {
  let component: GraphTreeSettingComponent;
  let fixture: ComponentFixture<GraphTreeSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphTreeSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTreeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
