import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonSidebarComponent } from './reason-sidebar.component';

describe('ReasonSidebarComponent', () => {
  let component: ReasonSidebarComponent;
  let fixture: ComponentFixture<ReasonSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
