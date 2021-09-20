import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlocksComponent } from './deadlocks.component';

describe('DeadlocksComponent', () => {
  let component: DeadlocksComponent;
  let fixture: ComponentFixture<DeadlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
