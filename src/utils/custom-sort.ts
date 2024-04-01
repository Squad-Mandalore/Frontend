export default function customSort(a: any, b: any, sortSettings: {property: string, direction: string}){
    if(sortSettings.property === "tracked_at"){
         a = new Date(a.split(".").reverse().join("/")).getTime();
         b = new Date(b.split(".").reverse().join("/")).getTime();
    }

    if(sortSettings.property === "category"){
        a = a.title;
        b = b.title;
    }

    if(sortSettings.direction === "asc" && a < b || sortSettings.direction === "desc" && a > b) return -1
    else if(sortSettings.direction === "asc" && a > b || sortSettings.direction === "desc" && a < b) return 1
    else return 0
}