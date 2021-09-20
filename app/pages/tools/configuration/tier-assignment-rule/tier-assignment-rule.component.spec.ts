import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TierAssignmentRuleComponent } from './tier-assignment-rule.component';

describe('TierAssignmentRuleComponent', () => {
  let component: TierAssignmentRuleComponent;
  let fixture: ComponentFixture<TierAssignmentRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TierAssignmentRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierAssignmentRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
