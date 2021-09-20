import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongValueComponent } from './long-value.component';

describe('LongValueComponent', () => {
  let component: LongValueComponent;
  let fixture: ComponentFixture<LongValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
