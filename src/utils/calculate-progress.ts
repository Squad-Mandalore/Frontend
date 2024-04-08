import { CompletesResponseSchema } from "../app/shared/generated";
import customFilter from "./custom-filter";

function getMaxValue(completesArray: CompletesResponseSchema[], category: string){
    const strengthElements = customFilter(completesArray, {category: {filterValue: category, valueFullFit: true} }, true, "athlete").map(element => element.points)
    return strengthElements.length !== 0 ? Math.max(...strengthElements) : 0;
}

function calculateProgress(completesArray: CompletesResponseSchema[]){
    const strenth = getMaxValue(completesArray, "Kraft");
    const stamina = getMaxValue(completesArray, "Ausdauer");
    const speed = getMaxValue(completesArray, "Schnelligkeit");
    const coordination = getMaxValue(completesArray, "Koordination");

    return speed + coordination + strenth + stamina;
}

function calculateProgressPercent(completesArray: CompletesResponseSchema[]){
    return calculateProgress(completesArray) / 12 * 100;
}

function calculateProgressColor(completesArray: CompletesResponseSchema[]){
    const progress = calculateProgress(completesArray);
    if(progress >= 11) return "var(--gold)";
    if(progress >= 8) return "var(--silver)";
    if(progress >= 4) return "var(--bronze)";
    return "var(--none)";
}

export {calculateProgress, calculateProgressColor, calculateProgressPercent}
