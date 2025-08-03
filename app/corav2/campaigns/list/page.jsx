import { Suspense } from 'react';

import CampaignsList from '../uiControl/CampaignsList';

import { InteprateCampaignsEvent } from '../dataControl/CampaignsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Campaigns"//searchParams?.mosyTitle || "Campaigns";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Campaigns`,
    description: 'corav2 Campaigns',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function CampaignsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <CampaignsList  
                    
                     dataIn={{ parentUseEffectKey: "loadCampaignsList" }}
                       
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