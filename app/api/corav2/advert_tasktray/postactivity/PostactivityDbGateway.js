
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert advert_tasktray 
export async function AddPostactivity(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("advert_tasktray", mutatedDataArray, body);
   
  return result;
}


//update advert_tasktray 
export async function UpdatePostactivity(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("advert_tasktray", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete advert_tasktray 
export async function DeletePostactivity(tokenId, whereStr)
{  
  const result = await mosySqlDelete("advert_tasktray", whereStr);

  return result;
}

