import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndicesComponent } from './create-indices.component';

describe('CreateIndicesComponent', () => {
  let component: CreateIndicesComponent;
  let fixture: ComponentFixture<CreateIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
