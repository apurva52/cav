import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdrSideBarComponent } from './ddr-side-bar.component';

describe('DdrSideBarComponent', () => {
  let component: DdrSideBarComponent;
  let fixture: ComponentFixture<DdrSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdrSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdrSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
