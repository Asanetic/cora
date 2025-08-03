import { Suspense } from 'react';

import LandingpagesList from '../uiControl/LandingpagesList';

import { InteprateLandingpagesEvent } from '../dataControl/LandingpagesRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Landing Pages"//searchParams?.mosyTitle || "Landing Pages";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Landing Pages`,
    description: 'corav2 Landing Pages',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function LandingpagesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <LandingpagesList  
                    
                     dataIn={{ parentUseEffectKey: "loadLandingpagesList" }}
                       
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