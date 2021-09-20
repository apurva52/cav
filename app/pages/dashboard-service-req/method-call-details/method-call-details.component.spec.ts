import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodCallDetailsComponent } from './method-call-details.component';

describe('MethodCallDetailsComponent', () => {
  let component: MethodCallDetailsComponent;
  let fixture: ComponentFixture<MethodCallDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodCallDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodCallDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
