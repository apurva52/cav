import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackFlowchartSidebarComponent } from './callback-flowchart-sidebar.component';

describe('CallbackFlowchartSidebarComponent', () => {
  let component: CallbackFlowchartSidebarComponent;
  let fixture: ComponentFixture<CallbackFlowchartSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackFlowchartSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackFlowchartSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
