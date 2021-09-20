import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostUsedMethodsComponent } from './most-used-methods.component';

describe('MostUsedMethodsComponent', () => {
  let component: MostUsedMethodsComponent;
  let fixture: ComponentFixture<MostUsedMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostUsedMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostUsedMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
