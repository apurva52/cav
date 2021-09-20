import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangVendersComponent } from './mang-venders.component';

describe('MangVendersComponent', () => {
  let component: MangVendersComponent;
  let fixture: ComponentFixture<MangVendersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangVendersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangVendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
