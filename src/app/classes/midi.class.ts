export enum MIDIPortType { input, output };
export enum MIDIPortDeviceState { disconnected, connected };
export enum MIDIPortConnectionState { open, closed, pending };

export interface MIDIPort {
  readonly id: string,
  readonly manufacturer?: string | null,
  readonly name?: string | null,
  readonly version?: string | null,
  readonly type: MIDIPortType,
  readonly state: MIDIPortDeviceState,
  readonly connection: MIDIPortConnectionState,
  open: () => Promise<MIDIPort>,
  close: () => Promise<MIDIPort>
}

export interface MIDIMessageEvent {
  readonly receivedTime: number,
  readonly data: Uint8Array
};

export interface MIDIInput {
  value: {
    onmidimessage: (message: MIDIMessageEvent) => void
  },
  done: boolean
}

export interface Iterator {
  next: () => MIDIInput
}

export interface MIDIInputMap {
  values: () => Iterator
};

export interface MIDIOutputMap {};

export interface MIDIAccess {
  readonly inputs: MIDIInputMap,
  readonly outputs: MIDIOutputMap,
  readonly sysexEnabled: boolean
};

Navigator