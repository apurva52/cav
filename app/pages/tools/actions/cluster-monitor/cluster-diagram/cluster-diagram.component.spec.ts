import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterDiagramComponent } from './cluster-diagram.component';

describe('ClusterDiagramComponent', () => {
  let component: ClusterDiagramComponent;
  let fixture: ComponentFixture<ClusterDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
