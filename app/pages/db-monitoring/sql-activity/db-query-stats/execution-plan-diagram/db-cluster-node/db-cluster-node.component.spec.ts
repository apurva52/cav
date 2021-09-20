import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbClusterNodeComponent } from './db-cluster-node.component';

describe('DbClusterNodeComponent', () => {
  let component: DbClusterNodeComponent;
  let fixture: ComponentFixture<DbClusterNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbClusterNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbClusterNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
