import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemleakAnalyzerComponent } from './memleak-analyzer.component';

describe('MemleakAnalyzerComponent', () => {
  let component: MemleakAnalyzerComponent;
  let fixture: ComponentFixture<MemleakAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemleakAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemleakAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
