import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugToolComponent } from './debug-tool.component';

describe('DebugToolComponent', () => {
  let component: DebugToolComponent;
  let fixture: ComponentFixture<DebugToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
