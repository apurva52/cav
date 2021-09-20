import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NogroupingComponent } from './nogrouping.component';

describe('NogroupingComponent', () => {
  let component: NogroupingComponent;
  let fixture: ComponentFixture<NogroupingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NogroupingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NogroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
