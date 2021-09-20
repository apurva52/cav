import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNdeServerComponent } from './add-nde-server.component';

describe('AddNdeServerComponent', () => {
  let component: AddNdeServerComponent;
  let fixture: ComponentFixture<AddNdeServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNdeServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNdeServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
