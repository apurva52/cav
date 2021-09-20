import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbNodeIndicesComponent } from './db-node-indices.component';

describe('DbNodeIndicesComponent', () => {
  let component: DbNodeIndicesComponent;
  let fixture: ComponentFixture<DbNodeIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbNodeIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbNodeIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
