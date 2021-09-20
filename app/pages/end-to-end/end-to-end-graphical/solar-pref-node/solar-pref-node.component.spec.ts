import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPrefNodeComponent } from './solar-pref-node.component';

describe('SolarPrefNodeComponent', () => {
  let component: SolarPrefNodeComponent;
  let fixture: ComponentFixture<SolarPrefNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolarPrefNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolarPrefNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
