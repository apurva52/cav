import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveCapabilitiesComponent } from './add-remove-capabilities.component';

describe('AddRemoveCapabilitiesComponent', () => {
  let component: AddRemoveCapabilitiesComponent;
  let fixture: ComponentFixture<AddRemoveCapabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveCapabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
