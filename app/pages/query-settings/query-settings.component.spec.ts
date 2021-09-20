import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySettingsComponent } from './query-settings.component';

describe('QuerySettingsComponent', () => {
  let component: QuerySettingsComponent;
  let fixture: ComponentFixture<QuerySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
