import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanMethodsComponent } from './comman-methods.component';

describe('CommanMethodsComponent', () => {
  let component: CommanMethodsComponent;
  let fixture: ComponentFixture<CommanMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommanMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
