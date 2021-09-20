import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangTeamComponent } from './mang-team.component';

describe('MangTeamComponent', () => {
  let component: MangTeamComponent;
  let fixture: ComponentFixture<MangTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
