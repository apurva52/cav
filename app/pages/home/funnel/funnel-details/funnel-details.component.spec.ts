import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelDetailsComponent } from './funnel-details.component';

describe('FunnelDetailsComponent', () => {
  let component: FunnelDetailsComponent;
  let fixture: ComponentFixture<FunnelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
