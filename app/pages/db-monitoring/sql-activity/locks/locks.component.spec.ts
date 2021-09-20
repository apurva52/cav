import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocksComponent } from './locks.component';

describe('LocksComponent', () => {
  let component: LocksComponent;
  let fixture: ComponentFixture<LocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
