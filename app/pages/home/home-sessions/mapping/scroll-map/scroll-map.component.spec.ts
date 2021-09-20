import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollMapComponent } from './scroll-map.component';

describe('ScrollMapComponent', () => {
  let component: ScrollMapComponent;
  let fixture: ComponentFixture<ScrollMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
