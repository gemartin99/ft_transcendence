import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTwoFactorComponent } from './edit-two-factor.component';

describe('EditTwoFactorComponent', () => {
  let component: EditTwoFactorComponent;
  let fixture: ComponentFixture<EditTwoFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTwoFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
