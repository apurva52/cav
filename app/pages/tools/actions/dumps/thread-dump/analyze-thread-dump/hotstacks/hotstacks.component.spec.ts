import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotstacksComponent } from './hotstacks.component';

describe('HotstacksComponent', () => {
  let component: HotstacksComponent;
  let fixture: ComponentFixture<HotstacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotstacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotstacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
