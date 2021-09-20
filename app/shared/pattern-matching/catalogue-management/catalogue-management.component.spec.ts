import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueManagementComponent } from './catalogue-management.component';

describe('CatalogueManagementComponent', () => {
  let component: CatalogueManagementComponent;
  let fixture: ComponentFixture<CatalogueManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
