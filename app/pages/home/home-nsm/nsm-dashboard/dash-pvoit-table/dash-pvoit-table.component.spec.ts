import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPvoitTableComponent } from './dash-pvoit-table.component';

describe('DashPvoitTableComponent', () => {
  let component: DashPvoitTableComponent;
  let fixture: ComponentFixture<DashPvoitTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashPvoitTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashPvoitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
