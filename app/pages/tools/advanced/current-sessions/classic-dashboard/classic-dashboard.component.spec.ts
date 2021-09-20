import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicDashboardComponent } from './classic-dashboard.component';

describe('ClassicDashboardComponent', () => {
  let component: ClassicDashboardComponent;
  let fixture: ComponentFixture<ClassicDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassicDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
