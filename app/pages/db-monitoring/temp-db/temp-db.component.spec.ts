import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempDBComponent } from './temp-db.component';

describe('TempDBComponent', () => {
  let component: TempDBComponent;
  let fixture: ComponentFixture<TempDBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempDBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
