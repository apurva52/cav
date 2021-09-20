import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpDetailComponent } from './http-detail.component';

describe('HttpDetailComponent', () => {
  let component: HttpDetailComponent;
  let fixture: ComponentFixture<HttpDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
