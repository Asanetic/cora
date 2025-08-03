import { Suspense } from 'react';

import PostactivityList from '../uiControl/PostactivityList';

import { IntepratePostactivityEvent } from '../dataControl/PostactivityRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Post activity"//searchParams?.mosyTitle || "Post activity";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Post activity`,
    description: 'corav2 Post activity',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function PostactivityMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <PostactivityList  
                    
                     dataIn={{ parentUseEffectKey: "loadPostactivityList" }}
                       
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