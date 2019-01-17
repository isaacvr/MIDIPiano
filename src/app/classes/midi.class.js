"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MIDIPortType;
(function (MIDIPortType) {
    MIDIPortType[MIDIPortType["input"] = 0] = "input";
    MIDIPortType[MIDIPortType["output"] = 1] = "output";
})(MIDIPortType = exports.MIDIPortType || (exports.MIDIPortType = {}));
;
var MIDIPortDeviceState;
(function (MIDIPortDeviceState) {
    MIDIPortDeviceState[MIDIPortDeviceState["disconnected"] = 0] = "disconnected";
    MIDIPortDeviceState[MIDIPortDeviceState["connected"] = 1] = "connected";
})(MIDIPortDeviceState = exports.MIDIPortDeviceState || (exports.MIDIPortDeviceState = {}));
;
var MIDIPortConnectionState;
(function (MIDIPortConnectionState) {
    MIDIPortConnectionState[MIDIPortConnectionState["open"] = 0] = "open";
    MIDIPortConnectionState[MIDIPortConnectionState["closed"] = 1] = "closed";
    MIDIPortConnectionState[MIDIPortConnectionState["pending"] = 2] = "pending";
})(MIDIPortConnectionState = exports.MIDIPortConnectionState || (exports.MIDIPortConnectionState = {}));
;
;
;
;
;
Navigator;
