import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {JsErrorDetailComponent } from './jserror-detail.component';

describe('JsErrorDetailComponent', () => {
  let component: JsErrorDetailComponent;
  let fixture: ComponentFixture<JsErrorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JsErrorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsErrorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

