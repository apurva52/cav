import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagealertComponent } from './messagealert.component';

describe('MessagealertComponent', () => {
  let component: MessagealertComponent;
  let fixture: ComponentFixture<MessagealertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagealertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
