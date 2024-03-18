export default function customFilter(array: any[], filterOptions: Object, selectionFullFit: boolean = false){
  return array.filter(element => {

    const entries = Object.entries(filterOptions);
    if (entries.length === 0) return element;
    
    let counter = 0;
    for (const [key, value] of entries){
      if (!value.filterValue) counter++;
      else if (value.valueFullFit && element[key] === value.filterValue) counter++;
      else if (!value.valueFullFit && element[key].toLowerCase().includes(value.filterValue.toLowerCase())) counter++;
    }
    
    if (selectionFullFit && counter === entries.length || !selectionFullFit && counter >=1) return element;
  })
}