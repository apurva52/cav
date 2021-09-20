import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangLocationComponent } from './mang-location.component';

describe('MangLocationComponent', () => {
  let component: MangLocationComponent;
  let fixture: ComponentFixture<MangLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
