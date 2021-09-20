import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSessionsComponent } from './home-sessions.component';

describe('HomeSessionsComponent', () => {
  let component: HomeSessionsComponent;
  let fixture: ComponentFixture<HomeSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
