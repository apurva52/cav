import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFilterComponent } from './session-filter.component';

describe('SessionFilterComponent', () => {
  let component: SessionFilterComponent;
  let fixture: ComponentFixture<SessionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
