import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHavocComponent } from './create-havoc.component';

describe('CreateHavocComponent', () => {
  let component: CreateHavocComponent;
  let fixture: ComponentFixture<CreateHavocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHavocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHavocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
