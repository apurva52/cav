import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlertRulesComponent } from './add-alert-rules.component';

describe('AddAlertRulesComponent', () => {
  let component: AddAlertRulesComponent;
  let fixture: ComponentFixture<AddAlertRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAlertRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlertRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
