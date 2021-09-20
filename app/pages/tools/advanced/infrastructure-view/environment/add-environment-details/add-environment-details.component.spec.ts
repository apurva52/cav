import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnvironmentDetailsComponent } from './add-environment-details.component';

describe('AddEnvironmentDetailsComponent', () => {
  let component: AddEnvironmentDetailsComponent;
  let fixture: ComponentFixture<AddEnvironmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEnvironmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEnvironmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
