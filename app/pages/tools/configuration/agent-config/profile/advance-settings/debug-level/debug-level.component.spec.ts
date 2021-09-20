import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugLevelComponent } from './debug-level.component';

describe('DebugLevelComponent', () => {
  let component: DebugLevelComponent;
  let fixture: ComponentFixture<DebugLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
