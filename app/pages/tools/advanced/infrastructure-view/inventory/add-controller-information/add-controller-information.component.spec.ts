import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddControllerInformationComponent } from './add-controller-information.component';

describe('AddControllerInformationComponent', () => {
  let component: AddControllerInformationComponent;
  let fixture: ComponentFixture<AddControllerInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddControllerInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControllerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
