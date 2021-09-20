import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTierGroupComponent } from './add-tier-group.component';

describe('AddTierGroupComponent', () => {
  let component: AddTierGroupComponent;
  let fixture: ComponentFixture<AddTierGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTierGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
