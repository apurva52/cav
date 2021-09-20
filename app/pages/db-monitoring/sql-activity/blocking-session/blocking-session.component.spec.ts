import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockingSessionComponent } from './blocking-session.component';

describe('BlockingSessionComponent', () => {
  let component: BlockingSessionComponent;
  let fixture: ComponentFixture<BlockingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockingSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
