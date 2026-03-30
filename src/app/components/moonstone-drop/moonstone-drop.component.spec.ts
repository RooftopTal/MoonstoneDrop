import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonstoneDropComponent } from './moonstone-drop.component';

describe('MoonstoneDropComponent', () => {
  let component: MoonstoneDropComponent;
  let fixture: ComponentFixture<MoonstoneDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoonstoneDropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoonstoneDropComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
