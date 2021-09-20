import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSessionComponent } from './advanced-session.component';

describe('AdvancedSessionComponent', () => {
  let component: AdvancedSessionComponent;
  let fixture: ComponentFixture<AdvancedSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
