import { type CarriersApi } from "./getCarriersName"

interface CustomCheckoutWindow extends Window {
    SELANUSAAPIURL?: string;
}

const customCheckoutWindow: CustomCheckoutWindow = window as CustomCheckoutWindow;

const { SELANUSAAPIURL = '' } = customCheckoutWindow;

export default async function GetDefaultCarriers() {
    try {

        const data= await fetch(`${SELANUSAAPIURL}/default-carriers`).then((response)=> response.json())
          
        const filteredNames= data.map((shipping:CarriersApi)=> shipping.name)
        
        return filteredNames
    } catch(e){
        // eslint-disable-next-line no-console
        console.error(e)
        
        return []
    }
}
  