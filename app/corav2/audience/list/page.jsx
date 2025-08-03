import { Suspense } from 'react';

import AudienceList from '../uiControl/AudienceList';

import { InteprateAudienceEvent } from '../dataControl/AudienceRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Audience"//searchParams?.mosyTitle || "Audience";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Audience`,
    description: 'corav2 Audience',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function AudienceMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <AudienceList  
                    
                     dataIn={{ parentUseEffectKey: "loadAudienceList" }}
                       
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