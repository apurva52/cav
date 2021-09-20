import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFilterSidebarComponent } from './page-filter-sidebar.component';

describe('PageFilterSidebarComponent', () => {
  let component: PageFilterSidebarComponent;
  let fixture: ComponentFixture<PageFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
