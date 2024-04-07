import { AthleteCompletesResponseSchema, CompletesResponseSchema } from "../app/shared/generated";
import customFilter from "./custom-filter";

function getMaxValue(completesArray: AthleteCompletesResponseSchema[], category: string){
    const strengthElements = customFilter(completesArray, {category: {filterValue: category, valueFullFit: true} }, true, "athlete").map(element => element.points)
    return strengthElements.length !== 0 ? Math.max(...strengthElements) : 0;
}

function calculateProgress(completesArray: AthleteCompletesResponseSchema[]){
    const strenth = getMaxValue(completesArray, "Kraft");
    const stamina = getMaxValue(completesArray, "Ausdauer");
    const speed = getMaxValue(completesArray, "Schnelligkeit");
    const coordination = getMaxValue(completesArray, "Koordination");

    return speed + coordination + strenth + stamina;
}

function calculateProgressPercent(completesArray: AthleteCompletesResponseSchema[]){
    return calculateProgress(completesArray) / 12 * 100;
}

function calculateProgressColor(completesArray: AthleteCompletesResponseSchema[]){
    const progress = calculateProgress(completesArray);
    if(progress >= 4 && progress <= 7) return "var(--bronze)";
    if(progress >= 8 && progress <= 10) return "var(--silver)";
    if(progress >= 11 && progress <= 12) return "var(--gold)";
    return "var(--none)";
}

export {calculateProgress, calculateProgressColor, calculateProgressPercent}