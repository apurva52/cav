import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainActivityComponent } from './domain-activity.component';

describe('DomainActivityComponent', () => {
  let component: DomainActivityComponent;
  let fixture: ComponentFixture<DomainActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
