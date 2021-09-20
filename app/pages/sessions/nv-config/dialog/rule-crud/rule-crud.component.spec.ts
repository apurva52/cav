import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCrudComponent } from './rule-crud.component';

describe('ruleCrudComponent', () => {
  let component: RuleCrudComponent;
  let fixture: ComponentFixture<RuleCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
