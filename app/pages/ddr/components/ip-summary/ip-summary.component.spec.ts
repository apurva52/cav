import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpSummaryComponent } from './ip-summary.component';

describe('IpSummaryComponent', () => {
  let component: IpSummaryComponent;
  let fixture: ComponentFixture<IpSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
