import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCrudComponent } from './channel-crud.component';

describe('ChannelCrudComponent', () => {
  let component: ChannelCrudComponent;
  let fixture: ComponentFixture<ChannelCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
