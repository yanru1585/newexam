export const Down=(url:string)=>{
  let a = document.createElement('a')
  a.style.display='none'
  a.href=url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const Downblob=(file:any,fileName:string)=>{
  let blob = new Blob([file], {type: 'application/vnd.ms-excel'});  
  let url= URL.createObjectURL(blob);
  let a = document.createElement('a')
  a.href=url
  a.setAttribute('download',fileName);
  a.style.display='none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}