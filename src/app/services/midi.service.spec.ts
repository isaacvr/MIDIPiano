import { TestBed } from '@angular/core/testing';

import { MIDIService } from './midi.service';

describe('MIDIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MIDIService = TestBed.get(MIDIService);
    expect(service).toBeTruthy();
  });
});
