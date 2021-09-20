import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackLocalvarComponent } from './callback-localvar.component';

describe('CallbackLocalvarComponent', () => {
  let component: CallbackLocalvarComponent;
  let fixture: ComponentFixture<CallbackLocalvarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackLocalvarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackLocalvarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
