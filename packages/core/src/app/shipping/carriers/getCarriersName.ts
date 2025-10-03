export interface CarriersApi {
    id: number
    bigcommerce_id: number
    deliver_id: number
    default?: boolean
    name: string
    create_at: Date
}

interface CustomCheckoutWindow extends Window {
    SELANUSAAPIURL?: string;
}

const customCheckoutWindow: CustomCheckoutWindow = window as CustomCheckoutWindow;

const { SELANUSAAPIURL = '' } = customCheckoutWindow;

export default async function getCarriersName(shippingsArray:string[] = []) {
  try {
  
    const shippingsNumberArray= shippingsArray.map((element)=> parseInt(element, 10))
  
    const shippingsNumberArrayInString= JSON.stringify(shippingsNumberArray)
    
    const data= await fetch(`${SELANUSAAPIURL}/carriers?ids=${shippingsNumberArrayInString}`).then((response)=> response.json())

    if (!Array.isArray(data)) throw new Error(`Data is not an array: ${data?.message?.name}`);
      
    const filteredNames= data.map((shipping:CarriersApi)=> shipping.name)
    
    return filteredNames

  } catch(e){
    // eslint-disable-next-line no-console
    console.error(e)

    return [];
  }
}
