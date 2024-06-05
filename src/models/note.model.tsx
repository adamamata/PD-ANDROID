export class NotePosition {
    top: number = 100;
    right: number = 0;
    bottom: number = 150;
    left: number = 100;

    constructor(init?: Partial<NotePosition>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}

export class Note {
    title?: string;
    content?: string;
    color?: string;
    roomId?: string;
    userId?: string;
    id?: string;
    created?: Date;
    updated?: Date;
    isDeleted?: boolean;
    position: NotePosition = new NotePosition();

    constructor(init?: Partial<Note>) {
        if (init) {
            Object.assign(this, init);
        }

        if (!this.position) {
            this.position = new NotePosition();
        }
    }
}