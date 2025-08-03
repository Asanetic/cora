
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert posting_activity 
export async function AddPostingactivity(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("posting_activity", mutatedDataArray, body);
   
  return result;
}


//update posting_activity 
export async function UpdatePostingactivity(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("posting_activity", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete posting_activity 
export async function DeletePostingactivity(tokenId, whereStr)
{  
  const result = await mosySqlDelete("posting_activity", whereStr);

  return result;
}

