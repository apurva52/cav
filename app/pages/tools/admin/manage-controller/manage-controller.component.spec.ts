import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageControllerComponent } from './manage-controller.component';

describe('ManageControllerComponent', () => {
  let component: ManageControllerComponent;
  let fixture: ComponentFixture<ManageControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
