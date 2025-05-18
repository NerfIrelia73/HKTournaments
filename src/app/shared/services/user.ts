export interface User {
    uid: string;
    email: string;
    displayName: string;
    discordId: string;
    twitch: string;
    pronouns: string;
    siteAdmin: boolean;
    photoURL: string;
    emailVerified: boolean;
 }

 export interface Participant {
    displayName: string;
    uid: string;
    seed: number;
 }