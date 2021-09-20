import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedIndicesComponent } from './selected-indices.component';

describe('SelectedIndicesComponent', () => {
  let component: SelectedIndicesComponent;
  let fixture: ComponentFixture<SelectedIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
