import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddControllerInfoComponent } from './add-controller-info.component';

describe('AddControllerInfoComponent', () => {
  let component: AddControllerInfoComponent;
  let fixture: ComponentFixture<AddControllerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddControllerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControllerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
