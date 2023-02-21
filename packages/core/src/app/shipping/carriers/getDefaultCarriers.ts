import { CarriersApi } from "./getCarriersName"

export default async function GetDefaultCarriers() {
    try {

        const SELANUSAAPIURL= process.env.SELANUSAAPIURL || ''
      
        const data= await fetch(`${SELANUSAAPIURL}/default-carriers`).then((response)=> response.json())
          
        const filteredNames= data.map((shipping:CarriersApi)=> shipping.name)
        
        return filteredNames
    } catch(e){
        // eslint-disable-next-line no-console
        console.error(e)
        
        return []
    }
}
  