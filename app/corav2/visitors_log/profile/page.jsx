import { Suspense } from 'react';

import VisitorslogProfile from '../uiControl/VisitorslogProfile';

import { InteprateVisitorslogEvent } from '../dataControl/VisitorslogRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Visitors Log profile"//searchParams?.mosyTitle || "Visitors Log";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Visitors Log profile`,
    description: 'corav2 Visitors Log',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function VisitorslogMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <VisitorslogProfile 
                    dataIn={{ parentUseEffectKey: "initVisitorslogProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateVisitorslogEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}