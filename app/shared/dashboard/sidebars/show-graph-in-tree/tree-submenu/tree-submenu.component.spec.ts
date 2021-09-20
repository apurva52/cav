import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeSubmenuComponent } from './tree-submenu.component';

describe('TreeSubmenuComponent', () => {
  let component: TreeSubmenuComponent;
  let fixture: ComponentFixture<TreeSubmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeSubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
