import { Suspense } from 'react';

import ActionmessagesProfile from '../uiControl/ActionmessagesProfile';

import { InteprateActionmessagesEvent } from '../dataControl/ActionmessagesRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Action Messages profile"//searchParams?.mosyTitle || "Action Messages";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Action Messages profile`,
    description: 'corav2 Action Messages',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function ActionmessagesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <ActionmessagesProfile 
                    dataIn={{ parentUseEffectKey: "initActionmessagesProfile" }} 
                                           
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