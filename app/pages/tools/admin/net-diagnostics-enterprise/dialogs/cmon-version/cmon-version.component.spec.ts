import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmonVersionComponent } from './cmon-version.component';

describe('CmonVersionComponent', () => {
  let component: CmonVersionComponent;
  let fixture: ComponentFixture<CmonVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmonVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmonVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
