import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmDashboardComponent } from './nsm-dashboard.component';

describe('NsmDashboardComponent', () => {
  let component: NsmDashboardComponent;
  let fixture: ComponentFixture<NsmDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
