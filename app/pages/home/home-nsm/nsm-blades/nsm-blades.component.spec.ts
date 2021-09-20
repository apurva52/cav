import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmBladesComponent } from './nsm-blades.component';

describe('NsmBladesComponent', () => {
  let component: NsmBladesComponent;
  let fixture: ComponentFixture<NsmBladesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmBladesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmBladesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
