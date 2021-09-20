import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavissonServicesComponent } from './cavisson-services.component';

describe('CavissonServicesComponent', () => {
  let component: CavissonServicesComponent;
  let fixture: ComponentFixture<CavissonServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavissonServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavissonServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
