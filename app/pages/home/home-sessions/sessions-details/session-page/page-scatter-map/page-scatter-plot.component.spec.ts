import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageScatterplotComponent } from './page-scatter-plot.component';

describe('PageScatterMapComponent', () => {
  let component: PageScatterplotComponent;
  let fixture: ComponentFixture<PageScatterplotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageScatterplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageScatterplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
