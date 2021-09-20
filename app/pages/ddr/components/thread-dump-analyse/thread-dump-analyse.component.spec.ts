import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadDumpAnalyseComponent } from './thread-dump-analyse.component';

describe('ThreadDumpAnalyseComponent', () => {
  let component: ThreadDumpAnalyseComponent;
  let fixture: ComponentFixture<ThreadDumpAnalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadDumpAnalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadDumpAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
