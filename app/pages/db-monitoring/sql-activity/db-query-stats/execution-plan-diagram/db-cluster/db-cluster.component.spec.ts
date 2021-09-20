import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbClusterComponent } from './db-cluster.component';

describe('DbClusterComponent', () => {
  let component: DbClusterComponent;
  let fixture: ComponentFixture<DbClusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbClusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
