import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsErrrFilterSidebarComponent } from './js-error-filter-sidebar.component';

describe('JsErrorFilterSidebarComponent', () => {
  let component: JsErrorFilterSidebarComponent;
  let fixture: ComponentFixture<JsErrorFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsErrorFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsErrorFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
