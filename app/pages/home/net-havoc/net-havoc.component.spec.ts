import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetHavocComponent } from './net-havoc.component';

describe('NetHavocComponent', () => {
  let component: NetHavocComponent;
  let fixture: ComponentFixture<NetHavocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetHavocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetHavocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
