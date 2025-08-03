
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert visitors_log 
export async function AddVisitorslog(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("visitors_log", mutatedDataArray, body);
   
  return result;
}


//update visitors_log 
export async function UpdateVisitorslog(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("visitors_log", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete visitors_log 
export async function DeleteVisitorslog(tokenId, whereStr)
{  
  const result = await mosySqlDelete("visitors_log", whereStr);

  return result;
}

