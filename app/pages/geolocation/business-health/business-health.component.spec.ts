import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHealthComponent } from './business-health.component';

describe('BusinessHealthComponent', () => {
  let component: BusinessHealthComponent;
  let fixture: ComponentFixture<BusinessHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
