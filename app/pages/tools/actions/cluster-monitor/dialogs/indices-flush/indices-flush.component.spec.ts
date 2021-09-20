import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesFlushComponent } from './indices-flush.component';

describe('IndicesFlushComponent', () => {
  let component: IndicesFlushComponent;
  let fixture: ComponentFixture<IndicesFlushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesFlushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesFlushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
