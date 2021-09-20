import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsErrorFilterComponent } from './js-error-filter.component';

describe('JsErrorFilterComponent', () => {
  let component: JsErrorFilterComponent;
  let fixture: ComponentFixture<JsErrorFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsErrorFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsErrorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
