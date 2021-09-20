import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsDetailsComponent } from './sessions-details.component';

describe('SessionsDetailsComponent', () => {
  let component: SessionsDetailsComponent;
  let fixture: ComponentFixture<SessionsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
