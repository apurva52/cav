import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmManageComponent } from './nsm-manage.component';

describe('NsmManageComponent', () => {
  let component: NsmManageComponent;
  let fixture: ComponentFixture<NsmManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
