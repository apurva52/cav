import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangChannelComponent } from './mang-channel.component';

describe('MangChannelComponent', () => {
  let component: MangChannelComponent;
  let fixture: ComponentFixture<MangChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
