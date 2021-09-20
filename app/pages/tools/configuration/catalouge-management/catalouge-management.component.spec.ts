import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalougeManagementComponent } from './catalouge-management.component';

describe('CatalougeManagementComponent', () => {
  let component: CatalougeManagementComponent;
  let fixture: ComponentFixture<CatalougeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalougeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalougeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
