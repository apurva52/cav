import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceDiagComponent } from './sequence-diag.component';

describe('SequenceDiagComponent', () => {
  let component: SequenceDiagComponent;
  let fixture: ComponentFixture<SequenceDiagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceDiagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceDiagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
