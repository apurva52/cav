import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualTableComponent } from './visual-table.component';

describe('VisualTableComponent', () => {
  let component: VisualTableComponent;
  let fixture: ComponentFixture<VisualTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
