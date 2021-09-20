import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeCmonComponent } from './upgrade-cmon.component';

describe('UpgradeCmonComponent', () => {
  let component: UpgradeCmonComponent;
  let fixture: ComponentFixture<UpgradeCmonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeCmonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeCmonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
