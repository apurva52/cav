import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDataComponent } from './session-data.component';

describe('SessionDataComponent', () => {
  let component: SessionDataComponent;
  let fixture: ComponentFixture<SessionDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
