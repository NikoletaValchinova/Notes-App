import { Document } from "mongoose";

export interface TagInterface extends Document {
    readonly id: string;
    readonly name: string;
    readonly color: string;
}