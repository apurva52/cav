import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplianceHealthComponent } from './appliance-health.component';

describe('ApplianceHealthComponent', () => {
  let component: ApplianceHealthComponent;
  let fixture: ComponentFixture<ApplianceHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplianceHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplianceHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
