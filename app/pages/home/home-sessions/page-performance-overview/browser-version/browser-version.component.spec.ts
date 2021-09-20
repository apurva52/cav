import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserVersionComponent } from './browser-version.component';

describe('BrowserVersionComponent', () => {
  let component: BrowserVersionComponent;
  let fixture: ComponentFixture<BrowserVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
