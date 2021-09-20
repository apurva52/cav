import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualResponseComponent } from './visual-response.component';

describe('VisualResponseComponent', () => {
  let component: VisualResponseComponent;
  let fixture: ComponentFixture<VisualResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
