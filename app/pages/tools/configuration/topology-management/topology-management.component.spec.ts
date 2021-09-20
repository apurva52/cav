import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyManagementComponent } from './topology-management.component';

describe('TopologyManagementComponent', () => {
  let component: TopologyManagementComponent;
  let fixture: ComponentFixture<TopologyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopologyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
