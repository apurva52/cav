import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrBreadCrumbComponent } from './ddr-bread-crumb.component';

describe('DdrBreadCrumbComponent', () => {
  let component: DdrBreadCrumbComponent;
  let fixture: ComponentFixture<DdrBreadCrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrBreadCrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrBreadCrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
