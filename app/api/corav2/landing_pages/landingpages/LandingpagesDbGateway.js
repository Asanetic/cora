
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert landing_pages 
export async function AddLandingpages(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("landing_pages", mutatedDataArray, body);
   
  return result;
}


//update landing_pages 
export async function UpdateLandingpages(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("landing_pages", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete landing_pages 
export async function DeleteLandingpages(tokenId, whereStr)
{  
  const result = await mosySqlDelete("landing_pages", whereStr);

  return result;
}

