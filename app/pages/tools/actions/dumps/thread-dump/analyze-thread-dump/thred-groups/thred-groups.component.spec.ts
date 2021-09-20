import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThredGroupsComponent } from './thred-groups.component';

describe('ThredGroupsComponent', () => {
  let component: ThredGroupsComponent;
  let fixture: ComponentFixture<ThredGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThredGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThredGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
