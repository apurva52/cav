import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageScatterMapComponent } from './page-scatter-map.component';

describe('PageScatterMapComponent', () => {
  let component: PageScatterMapComponent;
  let fixture: ComponentFixture<PageScatterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageScatterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageScatterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
