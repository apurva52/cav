import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsearchComponent } from './editsearch.component';

describe('EditsearchComponent', () => {
  let component: EditsearchComponent;
  let fixture: ComponentFixture<EditsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
