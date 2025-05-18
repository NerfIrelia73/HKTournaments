import { Timestamp } from "firebase/firestore";
import { Participant } from "./user";

export interface Tournament {
    name: string,
    uid: string,
    description: string,
    deadline: Timestamp,
    admins: string[],
    participants: Participant[],
    seedingEnabled: boolean,
}