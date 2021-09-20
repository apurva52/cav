import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserDefinedCommandComponent } from './add-user-defined-command.component';

describe('AddUserDefinedCommandComponent', () => {
  let component: AddUserDefinedCommandComponent;
  let fixture: ComponentFixture<AddUserDefinedCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserDefinedCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserDefinedCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
