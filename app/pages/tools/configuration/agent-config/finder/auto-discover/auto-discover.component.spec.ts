import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoDiscoverComponent } from './auto-discover.component';

describe('AutoDiscoverComponent', () => {
  let component: AutoDiscoverComponent;
  let fixture: ComponentFixture<AutoDiscoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoDiscoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
