import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NdAutoInjectComponent } from './nd-auto-inject.component';

describe('NdAutoInjectComponent', () => {
  let component: NdAutoInjectComponent;
  let fixture: ComponentFixture<NdAutoInjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NdAutoInjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdAutoInjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
