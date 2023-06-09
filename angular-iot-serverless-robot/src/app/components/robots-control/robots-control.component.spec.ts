import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotsControlComponent } from './robots-control.component';

describe('RobotsControlComponent', () => {
  let component: RobotsControlComponent;
  let fixture: ComponentFixture<RobotsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
