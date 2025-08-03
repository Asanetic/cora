import { Suspense } from 'react';

import LandingpagesProfile from '../uiControl/LandingpagesProfile';

import { InteprateLandingpagesEvent } from '../dataControl/LandingpagesRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Landing Pages profile"//searchParams?.mosyTitle || "Landing Pages";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Landing Pages profile`,
    description: 'corav2 Landing Pages',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function LandingpagesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <LandingpagesProfile 
                    dataIn={{ parentUseEffectKey: "initLandingpagesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateLandingpagesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}