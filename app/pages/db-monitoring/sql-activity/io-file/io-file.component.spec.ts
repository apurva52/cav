import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IoFileComponent } from './io-file.component';

describe('IoFileComponent', () => {
  let component: IoFileComponent;
  let fixture: ComponentFixture<IoFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IoFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IoFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
