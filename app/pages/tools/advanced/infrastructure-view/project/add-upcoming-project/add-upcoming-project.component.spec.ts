import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpcomingProjectComponent } from './add-upcoming-project.component';

describe('AddUpcomingProjectComponent', () => {
  let component: AddUpcomingProjectComponent;
  let fixture: ComponentFixture<AddUpcomingProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpcomingProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpcomingProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
