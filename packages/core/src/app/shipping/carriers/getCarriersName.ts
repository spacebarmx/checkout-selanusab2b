interface CarriersApi {
    id: number,
    bigcommerce_id: number,
    deliver_id: number,
    name: string,
    create_at: Date
}

export default async function getCarriersName(shippingsArray:string[]) {
  
  const shippingsNumberArray= shippingsArray.map((element)=> parseInt(element, 10))

  const shippingsNumberArrayInString= JSON.stringify(shippingsNumberArray)
  
  const data= await fetch(`https://beta.selanusa.com.mx/carriers?ids=${shippingsNumberArrayInString}`).then((response)=> response.json())
    
  const filteredNames= data.map((shipping:CarriersApi)=> shipping.name)
  
  return filteredNames
}
