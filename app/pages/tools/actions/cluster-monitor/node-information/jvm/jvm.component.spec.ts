import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvmComponent } from './jvm.component';

describe('JvmComponent', () => {
  let component: JvmComponent;
  let fixture: ComponentFixture<JvmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
