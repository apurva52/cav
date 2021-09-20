import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSessionFilterComponent } from './current-session-filter.component';

describe('CurrentSessionFilterComponent', () => {
  let component: CurrentSessionFilterComponent;
  let fixture: ComponentFixture<CurrentSessionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSessionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSessionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
