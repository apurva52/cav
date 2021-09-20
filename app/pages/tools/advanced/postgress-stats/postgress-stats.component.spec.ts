import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgressStatsComponent } from './postgress-stats.component';

describe('PostgressStatsComponent', () => {
  let component: PostgressStatsComponent;
  let fixture: ComponentFixture<PostgressStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostgressStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostgressStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
