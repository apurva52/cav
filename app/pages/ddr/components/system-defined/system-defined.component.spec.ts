import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDefinedComponent } from './system-defined.component';

describe('SystemDefinedComponent', () => {
  let component: SystemDefinedComponent;
  let fixture: ComponentFixture<SystemDefinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemDefinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
