import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertConfigureComponent } from './alert-configure.component';

describe('AlertConfigureComponent', () => {
  let component: AlertConfigureComponent;
  let fixture: ComponentFixture<AlertConfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertConfigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
