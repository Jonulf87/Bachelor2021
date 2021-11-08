export type CrewVm = {
    crewId: number;
    crewName: string;
}

export type CrewMemberVm = {
    id: string;
    name: string;
    phone: string;
    eMail: string;
    isLeader: boolean;
    comment: string;
}

export type CrewMainParams = {
    id: string;
}

export type CrewListVm = {
    id: number;
    name: string;
}