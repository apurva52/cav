import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComponentDetailsComponent } from './page-component-details.component';

describe('PageComponentDetailsComponent', () => {
  let component: PageComponentDetailsComponent;
  let fixture: ComponentFixture<PageComponentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageComponentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
