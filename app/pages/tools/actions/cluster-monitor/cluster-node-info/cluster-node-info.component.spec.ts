import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterNodeInfoComponent } from './cluster-node-info.component';

describe('ClusterNodeInfoComponent', () => {
  let component: ClusterNodeInfoComponent;
  let fixture: ComponentFixture<ClusterNodeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterNodeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterNodeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
