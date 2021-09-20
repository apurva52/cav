import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareQueriesComponent } from './compare-queries.component';

describe('CompareQueriesComponent', () => {
  let component: CompareQueriesComponent;
  let fixture: ComponentFixture<CompareQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
