import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditChildComponent } from './group-edit-child.component';

describe('GroupEditChildComponent', () => {
  let component: GroupEditChildComponent;
  let fixture: ComponentFixture<GroupEditChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEditChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupEditChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
