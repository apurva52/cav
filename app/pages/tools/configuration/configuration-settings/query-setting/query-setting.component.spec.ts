import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySettingComponent } from './query-setting.component';

describe('QuerySettingComponent', () => {
  let component: QuerySettingComponent;
  let fixture: ComponentFixture<QuerySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
