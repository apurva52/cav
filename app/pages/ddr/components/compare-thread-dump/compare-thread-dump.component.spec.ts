import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareThreadDumpComponent } from './compare-thread-dump.component';

describe('CompareThreadDumpComponent', () => {
  let component: CompareThreadDumpComponent;
  let fixture: ComponentFixture<CompareThreadDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareThreadDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareThreadDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
