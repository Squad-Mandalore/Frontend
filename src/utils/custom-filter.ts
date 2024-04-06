export default function customFilter(array: any[], filterOptions: Object, selectionFullFit: boolean = false, type:string){
  return array.filter(element => {

    const entries = Object.entries(filterOptions);
    if (entries.length === 0) return element;
    
    let counter = 0;
    for (const [key, value] of entries){
      if (!value.filterValue) counter++;
      else if (key === "category" && type === "athlete"){
        if (value.valueFullFit && element.exercise.category.title.toString() === value.filterValue) counter++;
        else if (!value.valueFullFit &&  element.exercise.category.title.toString().toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
      }
      else if(key === "discipline" && type === "exercise"){
        if (value.valueFullFit && element.exercise.title.toString() === value.filterValue) counter++;
        else if (!value.valueFullFit &&  element.exercise.title.toString().toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
      }
      else if(key === "category" && type === "exercise"){
        if (value.valueFullFit && element.exercise.category.title.toString() === value.filterValue) counter++;
        else if (!value.valueFullFit &&  element.exercise.category.title.toString().toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
      }
      else if (value.valueFullFit && element[key].toString() === value.filterValue) counter++;
      else if (!value.valueFullFit && element[key].toString().toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
    }
    
    if (selectionFullFit && counter === entries.length || !selectionFullFit && counter >=1) return element;
  })
}