import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutDelayInMethodComponent } from './put-delay-in-method.component';

describe('PutDelayInMethodComponent', () => {
  let component: PutDelayInMethodComponent;
  let fixture: ComponentFixture<PutDelayInMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutDelayInMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutDelayInMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
