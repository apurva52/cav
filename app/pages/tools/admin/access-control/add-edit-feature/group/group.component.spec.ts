import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GroupComponent } from "./group.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("GroupComponent", () => {

  let fixture: ComponentFixture<GroupComponent>;
  let component: GroupComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [GroupComponent]
    });

    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
