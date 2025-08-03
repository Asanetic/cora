
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert campaigns 
export async function AddCampaigns(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("campaigns", mutatedDataArray, body);
   
  return result;
}


//update campaigns 
export async function UpdateCampaigns(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("campaigns", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete campaigns 
export async function DeleteCampaigns(tokenId, whereStr)
{  
  const result = await mosySqlDelete("campaigns", whereStr);

  return result;
}

