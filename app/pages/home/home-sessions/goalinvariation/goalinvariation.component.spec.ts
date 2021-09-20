import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalinvariationComponent } from './goalinvariation.component';

describe('GoalinvariationComponent', () => {
  let component: GoalinvariationComponent;
  let fixture: ComponentFixture<GoalinvariationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalinvariationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalinvariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

