export default function customSort(a: any, b: any, sortSettings: {property: string, direction: string}, type: string){
    let element_a;
    let element_b;

    if(sortSettings.property === "tracked_at"){
        element_a = new Date(a[sortSettings.property].split(".").reverse().join("/")).getTime();
        element_b = new Date(b[sortSettings.property].split(".").reverse().join("/")).getTime();
    }
    else if(sortSettings.property === "category" && type === "athlete"){
        element_a = a.exercise_id.category.title;
        element_b = b.exercise_id.category.title;
    }
    else if(sortSettings.property === "category" && type === "exercise"){
        element_a = a.category.title;
        element_b = b.category.title;
    }
    else if(sortSettings.property === "discipline" && type === "athlete"){
        element_a = a.exercise_id.title;
        element_b = b.exercise_id.title;
    }
    else{
        element_a = a[sortSettings.property];
        element_b = b[sortSettings.property];
    }

    if(sortSettings.direction === "asc" && element_a < element_b || sortSettings.direction === "desc" && element_a > element_b) return -1
    else if(sortSettings.direction === "asc" && element_a > element_b || sortSettings.direction === "desc" && element_a < element_b) return 1
    else return 0
}