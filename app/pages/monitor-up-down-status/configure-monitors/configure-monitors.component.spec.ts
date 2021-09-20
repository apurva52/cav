import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureMonitorsComponent } from './configure-monitors.component';

describe('ConfigureMonitorsComponent', () => {
  let component: ConfigureMonitorsComponent;
  let fixture: ComponentFixture<ConfigureMonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureMonitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
