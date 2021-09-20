import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesRefreshComponent } from './indices-refresh.component';

describe('IndicesRefreshComponent', () => {
  let component: IndicesRefreshComponent;
  let fixture: ComponentFixture<IndicesRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
