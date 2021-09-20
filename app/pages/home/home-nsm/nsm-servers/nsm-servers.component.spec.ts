import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmServersComponent } from './nsm-servers.component';

describe('NsmServersComponent', () => {
  let component: NsmServersComponent;
  let fixture: ComponentFixture<NsmServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
