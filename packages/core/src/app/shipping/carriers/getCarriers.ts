import getCarriersName from "./getCarriersName";

export async function getCarriers(userBcId: number | undefined) {
    
    const getCustomerJWT = async (apiAccountClientId:string) => {
                
        return fetch(`/customer/current.jwt?app_client_id=${apiAccountClientId}`)
        .then((response:any) => {
          
            if(response.status === 200) {
                // eslint-disable-next-line no-console
                console.log("response ok",response)
                
                return response.text();
            }
            
          return new Error(`response.status is ${response.status}`);
          
        })

        // eslint-disable-next-line no-console
        .catch(error => console.error(error));
    }
    const getStoreFrontToken= async ( jwtToken:any ) =>{
        
        const jwtTokenString=JSON.stringify(jwtToken)
        
        const url = `https://api.bundleb2b.net/api/io/auth/storefront?jwtToken=${jwtTokenString}`;

        return fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json'}})
        .then(res => res.json())
    }
    
      if(userBcId===undefined)return;
    
    try {

        const customerJWT= await getCustomerJWT("bj88s1spc7zsy3kiiuxgxnihyux1vy5")
        
        // eslint-disable-next-line no-console
        console.log("customerJWTFuera",customerJWT)
       
        const authtoken= await getStoreFrontToken(customerJWT)
        
        // eslint-disable-next-line no-console
        console.log("authTokenBundle",authtoken)
        
        const userInfo= await fetch(`https://api.bundleb2b.net/api/v2/users/${userBcId}?isBcId=1`,{
            headers:{
                authtoken
            }
        }).then((response)=> response.json()).then(res=>res.data)
    
        const  { userId: userBundleId }= userInfo    
                
    
        const extraFields= await fetch(`https://api.bundleb2b.net/api/v2/customers/${userBundleId}/companies`,{
            headers:{
                authtoken
            }
        }).then((response)=> response.json()).then(res => res.data.extraFields)

        const shippings= extraFields.find((field:any)=> field.fieldName=== 'Transporte')

        const shippingsArray= shippings.fieldValue.split(",")
        
        const shippingNamesFiltered= await getCarriersName(shippingsArray)
       
        return shippingNamesFiltered
    }catch(e){
        // eslint-disable-next-line no-console
        console.error("Error getting carriers",e)

        return undefined;
    }
}
