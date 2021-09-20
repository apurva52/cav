import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyFavoriteLinkBoxComponent } from './copy-favorite-link-box.component';

describe('ConfigureIndexPatternComponent', () => {
  let component: CopyFavoriteLinkBoxComponent;
  let fixture: ComponentFixture<CopyFavoriteLinkBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CopyFavoriteLinkBoxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyFavoriteLinkBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
