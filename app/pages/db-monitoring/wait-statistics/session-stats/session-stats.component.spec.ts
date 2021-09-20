import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionStatsComponent } from './session-stats.component';

describe('SessionStatsComponent', () => {
  let component: SessionStatsComponent;
  let fixture: ComponentFixture<SessionStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
