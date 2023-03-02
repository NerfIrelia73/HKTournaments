export interface adminInfo {
    uid: string;
    displayName: string;
    tournaments: {admin: string, superadmin: string, tournamnetId: string}[]
}