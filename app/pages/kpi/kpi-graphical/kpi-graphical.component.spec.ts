import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraphicalComponent } from './kpi-graphical.component';

describe('KpiGraphicalComponent', () => {
  let component: KpiGraphicalComponent;
  let fixture: ComponentFixture<KpiGraphicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiGraphicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiGraphicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
