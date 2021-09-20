import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulereportComponent } from './schedulereport.component';

describe('SchedulereportComponent', () => {
  let component: SchedulereportComponent;
  let fixture: ComponentFixture<SchedulereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
