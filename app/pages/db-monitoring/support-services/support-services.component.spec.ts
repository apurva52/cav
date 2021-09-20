import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportServicesComponent } from './support-services.component';

describe('SupportServicesComponent', () => {
  let component: SupportServicesComponent;
  let fixture: ComponentFixture<SupportServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
