import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionMapComponent } from './attention-map.component';

describe('AttentionMapComponent', () => {
  let component: AttentionMapComponent;
  let fixture: ComponentFixture<AttentionMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttentionMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttentionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
