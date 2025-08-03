import { Suspense } from 'react';

import PostingactivityProfile from '../uiControl/PostingactivityProfile';

import { IntepratePostingactivityEvent } from '../dataControl/PostingactivityRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Posting Activity profile"//searchParams?.mosyTitle || "Posting Activity";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Posting Activity profile`,
    description: 'corav2 Posting Activity',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function PostingactivityMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <PostingactivityProfile 
                    dataIn={{ parentUseEffectKey: "initPostingactivityProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: IntepratePostingactivityEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}