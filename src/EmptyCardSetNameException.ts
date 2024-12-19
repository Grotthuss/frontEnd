import { logErrorToServer } from "./logError";

export class EmptyCardSetNameException extends Error {
    constructor() {
        const message = "User did not enter a Card set name."
        super(message);
        this.name = "EmptyCardSetNameException";
        this.logError(message);
    }
    
    private async logError(message: string) {
        await logErrorToServer(message);
    }
}
