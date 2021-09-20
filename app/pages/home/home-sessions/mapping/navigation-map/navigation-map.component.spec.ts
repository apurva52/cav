import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMapComponent } from './navigation-map.component';

describe('NavigationMapComponent', () => {
  let component: NavigationMapComponent;
  let fixture: ComponentFixture<NavigationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
