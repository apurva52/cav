import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParserSettingComponent } from './parser-setting.component';

describe('ParserSettingComponent', () => {
  let component: ParserSettingComponent;
  let fixture: ComponentFixture<ParserSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParserSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParserSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
