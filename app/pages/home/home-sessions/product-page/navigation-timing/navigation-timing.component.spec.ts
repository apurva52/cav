import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTimingComponent } from './navigation-timing.component';

describe('NavigationTimingComponent', () => {
  let component: NavigationTimingComponent;
  let fixture: ComponentFixture<NavigationTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
