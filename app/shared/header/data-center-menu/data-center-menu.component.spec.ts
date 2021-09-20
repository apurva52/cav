import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCenterMenuComponent } from './data-center-menu.component';

describe('DataCenterMenuComponent', () => {
  let component: DataCenterMenuComponent;
  let fixture: ComponentFixture<DataCenterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCenterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCenterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
