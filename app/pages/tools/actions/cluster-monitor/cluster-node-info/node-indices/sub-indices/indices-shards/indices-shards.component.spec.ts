import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesShardsComponent } from './indices-shards.component';

describe('IndicesShardsComponent', () => {
  let component: IndicesShardsComponent;
  let fixture: ComponentFixture<IndicesShardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesShardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesShardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
