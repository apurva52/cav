import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPathDialogComponent } from './flow-path-dialog.component';

describe('FlowPathDialogComponent', () => {
  let component: FlowPathDialogComponent;
  let fixture: ComponentFixture<FlowPathDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPathDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPathDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
