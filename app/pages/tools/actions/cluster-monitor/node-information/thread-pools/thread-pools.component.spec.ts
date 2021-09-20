import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadPoolsComponent } from './thread-pools.component';

describe('ThreadPoolsComponent', () => {
  let component: ThreadPoolsComponent;
  let fixture: ComponentFixture<ThreadPoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadPoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
