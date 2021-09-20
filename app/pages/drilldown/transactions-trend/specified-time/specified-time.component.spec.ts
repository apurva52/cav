import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecifiedTimeComponent } from './specified-time.component';

describe('SpecifiedTimeComponent', () => {
  let component: SpecifiedTimeComponent;
  let fixture: ComponentFixture<SpecifiedTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecifiedTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecifiedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
