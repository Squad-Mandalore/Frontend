import Result from "./result"

export default interface Athlete {
    id: number,
    username: string,
    email: string,
    firstname: string,
    lastname: string,
    created_at: string,
    created_by: string,
    gender: string,
    date_of_birth: string,
    last_password_change: string,
    last_edited_at: string,
    type: string,
    numberBronzeMedals: number,
    numberSilverMedals: number,
    numberGoldMedals: number,
    hasSwimmingCertificate: boolean,
    results: Result[]
}