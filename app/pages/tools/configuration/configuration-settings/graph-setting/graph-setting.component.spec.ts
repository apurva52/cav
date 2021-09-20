import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSettingComponent } from './graph-setting.component';

describe('GraphSettingComponent', () => {
  let component: GraphSettingComponent;
  let fixture: ComponentFixture<GraphSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
