import { Suspense } from 'react';

import PostactivityProfile from '../uiControl/PostactivityProfile';

import { IntepratePostactivityEvent } from '../dataControl/PostactivityRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Post activity profile"//searchParams?.mosyTitle || "Post activity";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Post activity profile`,
    description: 'corav2 Post activity',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function PostactivityMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <PostactivityProfile 
                    dataIn={{ parentUseEffectKey: "initPostactivityProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: IntepratePostactivityEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}