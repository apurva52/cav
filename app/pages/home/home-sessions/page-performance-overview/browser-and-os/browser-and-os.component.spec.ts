import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAndOsComponent } from './browser-and-os.component';

describe('BrowserAndOsComponent', () => {
  let component: BrowserAndOsComponent;
  let fixture: ComponentFixture<BrowserAndOsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserAndOsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserAndOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
