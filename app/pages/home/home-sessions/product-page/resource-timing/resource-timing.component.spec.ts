import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTimingComponent } from './resource-timing.component';

describe('ResourceTimingComponent', () => {
  let component: ResourceTimingComponent;
  let fixture: ComponentFixture<ResourceTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
