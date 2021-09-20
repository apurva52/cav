import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpSummaryOpenBoxComponent } from './ip-summary-open-box.component';

describe('IpSummaryOpenBoxComponent', () => {
  let component: IpSummaryOpenBoxComponent;
  let fixture: ComponentFixture<IpSummaryOpenBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpSummaryOpenBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpSummaryOpenBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
