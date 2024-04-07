export default function customFilter(array: any[], filterOptions: Object, selectionFullFit: boolean = false, type:string){
  return array.filter(element => {

    const entries = Object.entries(filterOptions);
    if (entries.length === 0) return element;
    
    let counter = 0;
    for (const [key, value] of entries){
      if (!value.filterValue) counter++;
      else if (key === "category" && type === "athlete"){
        if (value.valueFullFit && element.exercise.category.title === value.filterValue) counter++;
        else if (!value.valueFullFit &&  element.exercise.category.title.toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
      }
      else if (key === "tracked_by" && type === "athlete"){
        if (value.valueFullFit && element.trainer.firstname === value.filterValue.firstname && element.trainer.lastname === value.filterValue.lastname) counter++;
        else if (!value.valueFullFit && element.trainer.firstname + ' ' + element.trainer.lastname.toLowerCase().includes(value.filterValue.firstname.toLowerCase() + ' ' + value.filterValue.lastname.toLowerCase())) counter++;
      }
      else if(key === "category" && type === "exercise"){
        if (value.valueFullFit && element.category.title === value.filterValue) counter++;
        else if (!value.valueFullFit &&  element.category.title.toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
      }
      else if (value.valueFullFit && element[key] === value.filterValue) counter++;
      else if (!value.valueFullFit && element[key].toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
    }
    
    if (selectionFullFit && counter === entries.length || !selectionFullFit && counter >=1) return element;
  })
}