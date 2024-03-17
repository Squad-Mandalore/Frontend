export default function customFilter(array: any[], filterOptions: Object, valueFullFit: boolean = true, selectionFullFit: boolean = true){
  return array.filter(element => {

    const entries = Object.entries(filterOptions);
    if (entries.length === 0) return element;
    
    let counter = 0;
    for (const [key, value] of entries){
      if (!value) counter++;
      else if (valueFullFit && element[key] === value) counter++;
      else if (!valueFullFit && element[key].toLowerCase().includes(value.toLowerCase())) counter++;
    }
    
    if (selectionFullFit && counter === entries.length || !selectionFullFit && counter >=1) return element;
  })
}