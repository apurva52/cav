import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndicesComponent } from './sub-indices.component';

describe('SubIndicesComponent', () => {
  let component: SubIndicesComponent;
  let fixture: ComponentFixture<SubIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
