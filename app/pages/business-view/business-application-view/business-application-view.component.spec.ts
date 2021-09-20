import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationViewComponent } from './business-application-view.component';

describe('BusinessApplicationViewComponent', () => {
  let component: BusinessApplicationViewComponent;
  let fixture: ComponentFixture<BusinessApplicationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessApplicationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
