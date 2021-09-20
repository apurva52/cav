import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadHotspotComponent } from './thread-hotspot.component';

describe('ThreadHotspotComponent', () => {
  let component: ThreadHotspotComponent;
  let fixture: ComponentFixture<ThreadHotspotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadHotspotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadHotspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
