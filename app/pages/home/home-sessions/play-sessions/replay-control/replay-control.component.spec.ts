import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayControlComponent } from './replay-control.component';

describe('ReplayControlComponent', () => {
  let component: ReplayControlComponent;
  let fixture: ComponentFixture<ReplayControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplayControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
