export interface CarriersApi {
    id: number
    bigcommerce_id: number
    deliver_id: number
    default?: boolean
    name: string
    create_at: Date
}

export default async function getCarriersName(shippingsArray:string[]) {
  try {
    const SELANUSAAPIURL= process.env.SELANUSAAPIURL || ''
  
    const shippingsNumberArray= shippingsArray.map((element)=> parseInt(element, 10))
  
    const shippingsNumberArrayInString= JSON.stringify(shippingsNumberArray)
    
    const data= await fetch(`${SELANUSAAPIURL}/carriers?ids=${shippingsNumberArrayInString}`).then((response)=> response.json())
      
    const filteredNames= data.map((shipping:CarriersApi)=> shipping.name)
    
    return filteredNames

  } catch(e){
    // eslint-disable-next-line no-console
    console.error(e)

    return [];
  }
}
