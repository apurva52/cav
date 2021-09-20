import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsVersionComponent } from './os-version.component';

describe('OsVersionComponent', () => {
  let component: OsVersionComponent;
  let fixture: ComponentFixture<OsVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
