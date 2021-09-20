import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionPolicyComponent } from './retention-policy.component';

describe('RetentionPolicyComponent', () => {
  let component: RetentionPolicyComponent;
  let fixture: ComponentFixture<RetentionPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetentionPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
