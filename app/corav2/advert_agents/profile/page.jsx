import { Suspense } from 'react';

import AdvertagentsProfile from '../uiControl/AdvertagentsProfile';

import { InteprateAdvertagentsEvent } from '../dataControl/AdvertagentsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Advert Agents profile"//searchParams?.mosyTitle || "Advert Agents";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Advert Agents profile`,
    description: 'corav2 Advert Agents',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function AdvertagentsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <AdvertagentsProfile 
                    dataIn={{ parentUseEffectKey: "initAdvertagentsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateAdvertagentsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}