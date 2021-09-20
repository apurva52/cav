import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BladeStatusComponent } from './blade-status.component';

describe('BladeStatusComponent', () => {
  let component: BladeStatusComponent;
  let fixture: ComponentFixture<BladeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BladeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BladeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
