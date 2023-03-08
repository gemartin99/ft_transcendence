import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUseroptionsComponent } from './chat-useroptions.component';

describe('ChatUseroptionsComponent', () => {
  let component: ChatUseroptionsComponent;
  let fixture: ComponentFixture<ChatUseroptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatUseroptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatUseroptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
