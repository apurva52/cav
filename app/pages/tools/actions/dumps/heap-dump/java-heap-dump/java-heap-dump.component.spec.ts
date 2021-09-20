import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JavaHeapDumpComponent } from './java-heap-dump.component';

describe('JavaHeapDumpComponent', () => {
  let component: JavaHeapDumpComponent;
  let fixture: ComponentFixture<JavaHeapDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JavaHeapDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JavaHeapDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
