import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpFilterComponent } from './http-filter.component';

describe('HttpFilterComponent', () => {
  let component: HttpFilterComponent;
  let fixture: ComponentFixture<HttpFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
