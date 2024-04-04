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
    birthday: string,
    last_password_change: string,
    last_edited_at: string,
    type: string,
    progress: number,
    progress_points: number,
    progress_medal: string,
    number_bronze_medals: number,
    number_silver_medals: number,
    number_gold_medals: number,
    certificates: [],
    completes: Result[]
}