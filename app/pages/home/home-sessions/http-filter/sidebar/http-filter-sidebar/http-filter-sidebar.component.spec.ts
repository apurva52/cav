import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpFilterSidebarComponent } from './http-filter-sidebar.component';

describe('HttpFilterSidebarComponent', () => {
  let component: HttpFilterSidebarComponent;
  let fixture: ComponentFixture<HttpFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
