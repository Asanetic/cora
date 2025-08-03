import { Suspense } from 'react';

import CampaignsProfile from '../uiControl/CampaignsProfile';

import { InteprateCampaignsEvent } from '../dataControl/CampaignsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Campaigns profile"//searchParams?.mosyTitle || "Campaigns";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Campaigns profile`,
    description: 'corav2 Campaigns',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function CampaignsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <CampaignsProfile 
                    dataIn={{ parentUseEffectKey: "initCampaignsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateCampaignsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}