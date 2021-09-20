import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesClearCacheComponent } from './indices-clear-cache.component';

describe('IndicesClearCacheComponent', () => {
  let component: IndicesClearCacheComponent;
  let fixture: ComponentFixture<IndicesClearCacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesClearCacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesClearCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
