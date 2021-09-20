import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsmlogsComponent } from './nsmlogs.component';

describe('NsmlogsComponent', () => {
  let component: NsmlogsComponent;
  let fixture: ComponentFixture<NsmlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsmlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsmlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
