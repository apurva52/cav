import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashFilterSidebarComponent } from './crash-filter-sidebar.component';

describe('CrashFilterSidebarComponent', () => {
  let component: CrashFilterSidebarComponent;
  let fixture: ComponentFixture<CrashFilterSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrashFilterSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashFilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
