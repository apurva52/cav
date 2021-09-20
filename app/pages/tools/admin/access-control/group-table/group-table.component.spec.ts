import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GroupTableComponent } from "./group-table.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("GroupTableComponent", () => {

  let fixture: ComponentFixture<GroupTableComponent>;
  let component: GroupTableComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [GroupTableComponent]
    });

    fixture = TestBed.createComponent(GroupTableComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
