import { User } from "../shared/services/user";

export interface Match {
    runners: User[];
    comms: User[];
    restreamer: User[];
    date: string;
    locked: boolean;
    matchId: string;
}