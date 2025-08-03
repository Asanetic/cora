import { Suspense } from 'react';

import ActionmessagesList from '../uiControl/ActionmessagesList';

import { InteprateActionmessagesEvent } from '../dataControl/ActionmessagesRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Action Messages"//searchParams?.mosyTitle || "Action Messages";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Action Messages`,
    description: 'corav2 Action Messages',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function ActionmessagesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ActionmessagesList  
                    
                     dataIn={{ parentUseEffectKey: "loadActionmessagesList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateActionmessagesEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }