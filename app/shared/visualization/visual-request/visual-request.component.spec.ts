import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualRequestComponent } from './visual-request.component';

describe('VisualRequestComponent', () => {
  let component: VisualRequestComponent;
  let fixture: ComponentFixture<VisualRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
