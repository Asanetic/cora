
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert audience 
export async function AddAudience(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("audience", mutatedDataArray, body);
   
  return result;
}


//update audience 
export async function UpdateAudience(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("audience", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete audience 
export async function DeleteAudience(tokenId, whereStr)
{  
  const result = await mosySqlDelete("audience", whereStr);

  return result;
}

