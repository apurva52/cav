import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NvConfigComponent } from './nv-config.component';

describe('NvConfigComponent', () => {
  let component: NvConfigComponent;
  let fixture: ComponentFixture<NvConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NvConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NvConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
