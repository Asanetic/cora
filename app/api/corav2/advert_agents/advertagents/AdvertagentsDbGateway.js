
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert advert_agents 
export async function AddAdvertagents(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("advert_agents", mutatedDataArray, body);
   
  return result;
}


//update advert_agents 
export async function UpdateAdvertagents(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("advert_agents", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete advert_agents 
export async function DeleteAdvertagents(tokenId, whereStr)
{  
  const result = await mosySqlDelete("advert_agents", whereStr);

  return result;
}

