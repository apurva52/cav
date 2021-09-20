import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatalougeComponent } from './add-catalouge.component';

describe('AddCatalougeComponent', () => {
  let component: AddCatalougeComponent;
  let fixture: ComponentFixture<AddCatalougeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCatalougeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCatalougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
