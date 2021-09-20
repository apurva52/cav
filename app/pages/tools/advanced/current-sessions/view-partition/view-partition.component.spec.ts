import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPartitionComponent } from './view-partition.component';

describe('ViewPartitionComponent', () => {
  let component: ViewPartitionComponent;
  let fixture: ComponentFixture<ViewPartitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPartitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPartitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
