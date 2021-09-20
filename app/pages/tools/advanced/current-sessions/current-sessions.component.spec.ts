import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSessionsComponent } from './current-sessions.component';

describe('CurrentSessionsComponent', () => {
  let component: CurrentSessionsComponent;
  let fixture: ComponentFixture<CurrentSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
