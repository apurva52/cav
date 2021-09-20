import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPatternComponent } from './index-pattern.component';

describe('IndexPatternComponent', () => {
  let component: IndexPatternComponent;
  let fixture: ComponentFixture<IndexPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
