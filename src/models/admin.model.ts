export interface ReplacementRule {
    id: string,
    firstNameMatch: string,
    lastNameMatch: string,
    firstNameReplacement: string,
    lastNameReplacement: string,
    createdAt: string,
}

export interface RookieProps {
    season: number,
    firstName: string,
    lastName: string,
    team: string,
    position: string,
}

export interface ReplacementRuleProps {
    fName: string,
    lName: string,
    fNameReplacement: string,
    lNameReplacement: string,
}

export interface RegisteredUser {
    email: string,
    role: string,
    firstName: string,
    lastName: string,
    createdAt: string,
    lastLogin: string,
}
