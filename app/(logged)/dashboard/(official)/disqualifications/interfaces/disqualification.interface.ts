interface Disqualification {
    athlete: {
        "id": string,
        "email": string,
        "displayName": string,
    },
    official: {
        "id": string,
        "email": string,
        "displayName": string,
    },
    reason: string,
    description: string,
    time: Date,
    id: string,
    reviewedByReferee: boolean,
}