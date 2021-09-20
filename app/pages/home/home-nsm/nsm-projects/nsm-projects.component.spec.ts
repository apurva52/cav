import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmProjectsComponent } from './nsm-projects.component';

describe('NsmProjectsComponent', () => {
  let component: NsmProjectsComponent;
  let fixture: ComponentFixture<NsmProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
