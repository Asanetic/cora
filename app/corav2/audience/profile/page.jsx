import { Suspense } from 'react';

import AudienceProfile from '../uiControl/AudienceProfile';

import { InteprateAudienceEvent } from '../dataControl/AudienceRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Audience profile"//searchParams?.mosyTitle || "Audience";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Audience profile`,
    description: 'corav2 Audience',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function AudienceMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <AudienceProfile 
                    dataIn={{ parentUseEffectKey: "initAudienceProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateAudienceEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}