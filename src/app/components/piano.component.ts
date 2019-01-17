import { Component, AfterViewInit } from '@angular/core';
import { MIDIMessageEvent, MIDIInput } from '../classes/midi.class';

const notesShape = [
  [ 'black', 'white', '1d', '1.7r', '0.45u', '0.7l', '0.55u', '1l' ],                     /// C
  [ 'black', 'black', '0.55d', '1r', '0.55u', '1l' ],                                     /// C#
  [ 'black', 'white', '0.55d', '0.3l', '0.45d', '1.7r', '0.45u', '0.4l', '0.55u', '1l' ], /// D
  [ 'black', 'black', '0.55d', '1r', '0.55u', '1l' ],                                     /// D#
  [ 'black', 'white', '0.55d', '0.7l', '0.45d', '1.7r', '1u', '1l' ],                     /// E
  [ 'black', 'white', '1d', '1.8r', '0.45u', '0.8l', '0.55u', '1l' ],                     /// F
  [ 'black', 'black', '0.55d', '1r', '0.55u', '1l' ],                                     /// F#
  [ 'black', 'white', '0.55d', '0.2l', '0.45d', '1.7r', '0.45u', '0.5l', '0.55u', '1l' ], /// G
  [ 'black', 'black', '0.55d', '1r', '0.55u', '1l' ],                                     /// G#
  [ 'black', 'white', '0.55d', '0.5l', '0.45d', '1.7r', '0.45u', '0.2l', '0.55u', '1l' ], /// A
  [ 'black', 'black', '0.55d', '1r', '0.55u', '1l' ],                                     /// Bb
  [ 'black', 'white', '0.55d', '0.8l', '0.45d', '1.8r', '1u', '1l' ],                     /// B
];

interface Track extends Array<MIDIMessageEvent> {
  trackLength: number,
  trackStrLength: string,
  locked: boolean
}

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.css']
})
export class PianoComponent implements AfterViewInit {

  cnv: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  notes: number;
  initialNote: number;
  pressed: boolean[];
  tracks: Track[];

  private id: string;
  private recording: boolean;
  private tempTrack: Track;

  constructor() {
    this.cnv = null;
    this.ctx = null;
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.notes = 76;
    this.initialNote = 28;
    this.pressed = (function() : boolean[] {
      var res: boolean[] = [];
      for (var i = 0; i <= 110; i += 1) {
        res.push(false);
      }
      return res;
    }());

    this.pressed[28] = true;
    this.pressed[103] = true;

    this.id = 'piano-' + Date.now();

    this.tracks = <Track[]> [
      <Track> {        
        trackLength: 10,
        trackStrLength: '2.45s',
        locked: false
      },
      <Track> {
        trackLength: 10,
        trackStrLength: '7.45s',
        locked: false
      }
    ];

  }

  ngAfterViewInit() {
    this.setCanvas(document.querySelector('#' + this.id));
  }

  messageHandler(message: MIDIMessageEvent) {
    this.executeMessage(message.data);
    console.log('MessageType: ', message.constructor.name);
    if ( this.recording === true ) {
      this.tempTrack.push(message);
    }
  }

  startRecording() {
    this.tempTrack = <Track>{
      trackLength: 0,
      trackStrLength: '0',
      locked: false
    };

    this.recording = true;
  }

  stopRecording() {
    var initTime = 1e10, finTime = -1, tm;
    var len = this.tempTrack.length;

    for (var i = 0; i < len; i += 1) {
      tm = this.tempTrack[i].receivedTime;

      if (tm < initTime) {
        initTime = tm;
      }

      if (tm > finTime) {
        finTime = tm;
      }

    }

    tm = finTime - initTime;

    this.tempTrack.trackLength = tm;
    this.tempTrack.trackStrLength = (Math.trunc(tm * 100) / 100).toString() + 's';

    this.tracks.push( this.tempTrack );
    this.recording = false;
  }

  removeRecording(index: number) {
    if ( index >= 0 && index < this.tracks.length ) {
      if ( this.tracks[index].locked === false ) {
        this.tracks.splice(index, 1);
      }
    }
  }

  executeMessage(data: Uint8Array) {
    if ( data.length > 1 && data[0] === 144 ) {
      console.log.apply(null, data);
      this.pressed[data[1]] = data[2] != 0; 
      this.drawPiano();
    }
  }

  async playRecording(index: number) {

    var tr: Track;
    var ct: number, fin: number, id: number;
    var last = Date.now();

    if ( index >= 0 && index < this.tracks.length ) {
      tr = this.tracks[index];
      tr.locked = true;
      
      id = 0;

      while ( id < tr.length ) {
        fin = tr[id].receivedTime;
        
        if (id === 0) {
          ct = fin;
        }

        ct = fin - ct;

        while( Date.now() - last < ct ) {}

        this.executeMessage(tr[id].data);

        ct = fin;

        id += 1;
        
      }

      tr.locked = false;

    }

  }

  setCanvas(cnv: HTMLCanvasElement) {

    if ( !(cnv instanceof HTMLCanvasElement) ) {
      throw new TypeError('The provided element is not an HTMLCanvasElement');
    }
  
    this.cnv = cnv;
    this.ctx = this.cnv.getContext('2d');
  
    this.maxX = this.cnv.width;
    this.maxY = this.cnv.height;
  
    this.drawPiano();
  
  }

  setMIDIInput(input: MIDIInput) {
    console.log('MessageType: ', input.constructor.name);
    input.value.onmidimessage = this.messageHandler.bind(this);
  }

  drawPiano() {

    if ( !(this.cnv instanceof HTMLCanvasElement) ) {
      throw new ReferenceError('Canvas element has not been defined yet');
    }
  
    var ctx = this.ctx;
    var maxX = this.maxX;
    var maxY = this.maxY;
  
    ctx.fillStyle = 'darkgray';
    ctx.fillRect(0, 0, maxX, maxY / 2);

    var ini = this.initialNote;
    var fin = this.initialNote + this.notes - 1;
  
    for (var i = ini; i <= fin; i += 1) {
      this.drawKey(i);
    }
  
  }

  pressNote(note: number) {
    note = ~~note;
    this.pressed[note] = true;
  }

  releaseNote(note: number) {
    note = ~~note;
    this.pressed[note] = false;
  }

  drawKey(note: number) {

    if ( !(this.cnv instanceof HTMLCanvasElement) ) {
      throw new ReferenceError('Canvas element has not been defined yet');
    }
  
    note = ~~note;
  
    if ( this.initialNote <= note && note <= this.initialNote + this.notes - 1 ) {
  
      var mx = this.maxX / ( this.notes + 2 );
      var my = this.maxY / 2;
      var offx = mx * (note - this.initialNote );
      var offy = my;
      var shapes = notesShape;
      var sx = 0, sy = 0;
      var px = 0, py = 0;
  
      var newNote = note % shapes.length;
  
      var noteShape = shapes[newNote];
  
      var len = noteShape.length;
  
      if ( !!this.pressed[note] ) {
        this.ctx.fillStyle = 'blue';
      } else {
        this.ctx.fillStyle = noteShape[1];
      }
  
      this.ctx.strokeStyle = noteShape[0];
      this.ctx.beginPath();
      this.ctx.moveTo(offx, my);
  
      for (var i = 2; i < len; i += 1) {
        if ( /u$/.test(noteShape[i]) === true ) {
          px = 0;
          py = -parseFloat(noteShape[i]);
        } else if ( /r$/.test(noteShape[i]) === true ) {
          px = parseFloat(noteShape[i]);
          py = 0;
        } else if ( /d$/.test(noteShape[i]) === true ) {
          px = 0;
          py = parseFloat(noteShape[i]);
        } else if ( /l$/.test(noteShape[i]) === true ) {
          px = -parseFloat(noteShape[i]);
          py = 0;
        }
  
        sx += px * mx;
        sy += py * my;
  
        this.ctx.lineTo(offx + sx, offy + sy);
      }
  
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
  
      /// TODO: Pintar al final la primera y la ultima nota.
  
    }
  
  
  }

}
