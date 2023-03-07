import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedUsersComponent } from './extended-users.component';

describe('ExtendedUsersComponent', () => {
  let component: ExtendedUsersComponent;
  let fixture: ComponentFixture<ExtendedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
