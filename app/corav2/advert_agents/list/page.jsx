import { Suspense } from 'react';

import AdvertagentsList from '../uiControl/AdvertagentsList';

import { InteprateAdvertagentsEvent } from '../dataControl/AdvertagentsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Advert Agents"//searchParams?.mosyTitle || "Advert Agents";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Advert Agents`,
    description: 'corav2 Advert Agents',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function AdvertagentsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <AdvertagentsList  
                    
                     dataIn={{ parentUseEffectKey: "loadAdvertagentsList" }}
                       
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