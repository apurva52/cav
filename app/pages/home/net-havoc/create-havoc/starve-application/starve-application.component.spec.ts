import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarveApplicationComponent } from './starve-application.component';

describe('StarveApplicationComponent', () => {
  let component: StarveApplicationComponent;
  let fixture: ComponentFixture<StarveApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
