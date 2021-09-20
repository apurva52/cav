import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGenarageColorManagementComponent } from './auto-genarage-color-management.component';

describe('AutoGenarageColorManagementComponent', () => {
  let component: AutoGenarageColorManagementComponent;
  let fixture: ComponentFixture<AutoGenarageColorManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoGenarageColorManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGenarageColorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
