import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsErrorComponent } from './js-error.component';

describe('JsErrorComponent', () => {
  let component: JsErrorComponent;
  let fixture: ComponentFixture<JsErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
