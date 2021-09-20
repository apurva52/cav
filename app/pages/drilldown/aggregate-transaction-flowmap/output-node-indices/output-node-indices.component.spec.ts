import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputNodeIndicesComponent } from './output-node-indices.component';

describe('OutputNodeIndicesComponent', () => {
  let component: OutputNodeIndicesComponent;
  let fixture: ComponentFixture<OutputNodeIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputNodeIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputNodeIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
