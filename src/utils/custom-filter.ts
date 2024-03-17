export default function customFilter(array: any[], filterOptions: Object, fullFit: boolean = false){
  return array.filter(element => {

    const filterOptionsEntryArray = Object.entries(filterOptions)
    if(filterOptionsEntryArray.length === 0) return element;
    
    let counter = 0;
    for (const [key, value] of filterOptionsEntryArray){
      if (!value) counter++;
      if (fullFit && element[key] === value) counter++;
      else if (!fullFit && element[key].toLowerCase().includes(value.toLowerCase())) counter++;
    }
    
    if (fullFit && counter === filterOptionsEntryArray.length || !fullFit && counter >=1) return element;
  })
}