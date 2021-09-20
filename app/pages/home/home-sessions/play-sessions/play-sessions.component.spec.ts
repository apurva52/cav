import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySessionsComponent } from './play-sessions.component';

describe('PlaySessionsComponent', () => {
  let component: PlaySessionsComponent;
  let fixture: ComponentFixture<PlaySessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaySessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
