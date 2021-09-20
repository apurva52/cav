import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdSessionsComponent } from './nd-sessions.component';

describe('NdSessionsComponent', () => {
  let component: NdSessionsComponent;
  let fixture: ComponentFixture<NdSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
