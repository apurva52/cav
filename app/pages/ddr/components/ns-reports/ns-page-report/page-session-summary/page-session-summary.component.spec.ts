import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSessionSummaryComponent } from './page-session-summary.component';

describe('PageSessionSummaryComponent', () => {
  let component: PageSessionSummaryComponent;
  let fixture: ComponentFixture<PageSessionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSessionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSessionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
