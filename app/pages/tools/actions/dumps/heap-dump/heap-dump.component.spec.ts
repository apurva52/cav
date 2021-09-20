import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeapDumpComponent } from './heap-dump.component';

describe('HeapDumpComponent', () => {
  let component: HeapDumpComponent;
  let fixture: ComponentFixture<HeapDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeapDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeapDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
