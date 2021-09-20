import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondLevelAuthorizationComponent } from './second-level-authorization.component';

describe('SecondLevelAuthorizationComponent', () => {
  let component: SecondLevelAuthorizationComponent;
  let fixture: ComponentFixture<SecondLevelAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondLevelAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondLevelAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
