import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertFilterComponent } from './alert-filter.component';

describe('AlertFilterComponent', () => {
  let component: AlertFilterComponent;
  let fixture: ComponentFixture<AlertFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
