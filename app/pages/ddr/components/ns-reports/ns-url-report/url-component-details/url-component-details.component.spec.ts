import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlComponentDetailsComponent } from './url-component-details.component';

describe('UrlComponentDetailsComponent', () => {
  let component: UrlComponentDetailsComponent;
  let fixture: ComponentFixture<UrlComponentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlComponentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlComponentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
