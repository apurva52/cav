import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlSessionSummaryComponent } from './url-session-summary.component';

describe('UrlSessionSummaryComponent', () => {
  let component: UrlSessionSummaryComponent;
  let fixture: ComponentFixture<UrlSessionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlSessionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlSessionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
