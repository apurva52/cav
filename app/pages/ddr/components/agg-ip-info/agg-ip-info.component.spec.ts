import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggIpInfoComponent } from './agg-ip-info.component';

describe('AggIpInfoComponent', () => {
  let component: AggIpInfoComponent;
  let fixture: ComponentFixture<AggIpInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggIpInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggIpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
