import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UserTableComponent } from "./user-table.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("UserTableComponent", () => {

  let fixture: ComponentFixture<UserTableComponent>;
  let component: UserTableComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [UserTableComponent]
    });

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
