import { Injectable } from '@angular/core';
import { MIDIAccess } from '../classes/midi.class';


@Injectable({
  providedIn: 'root'
})
export class MIDIService {

  constructor() { }

  start(success: (midi: MIDIAccess) => void, failure: () => void) {

    if ( navigator['requestMIDIAccess'] ) {
    
      navigator['requestMIDIAccess']()
        .then(success, failure);
  
    } else {
      
      failure();

    }

  }

}
