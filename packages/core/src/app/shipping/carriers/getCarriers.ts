import getCarriersName from "./getCarriersName";

interface CustomCheckoutWindow extends Window {
    BUNDLEURL?: string;
    BUNDLEAUTHTOKEN?: string;
}

const customCheckoutWindow: CustomCheckoutWindow = window as CustomCheckoutWindow;

const { BUNDLEAUTHTOKEN = '', BUNDLEURL = '' } = customCheckoutWindow;

export async function getCarriers(userBcId: number | undefined) {
    
    if(userBcId===undefined)return;
    
    try {
         
        const companiesIds = await fetch(`${BUNDLEURL}/v3/io/companies?customerId=${userBcId}`, 
            {
                headers: { 'Content-Type': 'application/json', authToken: BUNDLEAUTHTOKEN }
            }
        ) .then(response => response.json())
          .then(response => response.data.map((res:any)=>res.companyId))
        
        const multipleShippingsNames = await Promise.all(
            companiesIds.map(async (companyId: number)=>{
            
                const companyDetails= await fetch(`${BUNDLEURL}/v3/io/companies/${companyId}`, 
                {
                    headers: { 'Content-Type': 'application/json', authToken: BUNDLEAUTHTOKEN }
                }
                ).then(response => response.json())
                .then(response => response.data)
                
                const shippings= companyDetails.extraFields.find((field:any)=> field.fieldName=== 'Transporte:')

                const shippingsArray= shippings.fieldValue.split(",")
                
                const shippingNamesFiltered= await getCarriersName(shippingsArray)

                return shippingNamesFiltered

            })
        )
        
        const allMultipleShippingsNamesInASingleArray= multipleShippingsNames.flat()
       
        return allMultipleShippingsNamesInASingleArray
    }catch(e){
        // eslint-disable-next-line no-console
        console.error("Error getting carriers",e)

        return [];
    }
}
