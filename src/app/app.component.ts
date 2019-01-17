import { Component } from '@angular/core';
import { MIDIService } from './services/midi.service';
import { MIDIAccess } from './classes/midi.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MIDI Piano';

  constructor(midi: MIDIService) {
    midi.start(this.success, this.failure);
  }

  success(midi: MIDIAccess) {
    console.log(midi);
    var inputs = midi.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log(input);
    }
    
  }

  failure() {
    console.log('We have not access to MIDI devices');
  }

}
