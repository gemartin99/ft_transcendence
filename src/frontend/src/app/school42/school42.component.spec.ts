import { ComponentFixture, TestBed } from '@angular/core/testing';

import { School42Component } from './school42.component';

describe('School42Component', () => {
  let component: School42Component;
  let fixture: ComponentFixture<School42Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ School42Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(School42Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
