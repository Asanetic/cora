import { Suspense } from 'react';

import PostingactivityList from '../uiControl/PostingactivityList';

import { IntepratePostingactivityEvent } from '../dataControl/PostingactivityRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Posting Activity"//searchParams?.mosyTitle || "Posting Activity";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Posting Activity`,
    description: 'corav2 Posting Activity',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function PostingactivityMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <PostingactivityList  
                    
                     dataIn={{ parentUseEffectKey: "loadPostingactivityList" }}
                       
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