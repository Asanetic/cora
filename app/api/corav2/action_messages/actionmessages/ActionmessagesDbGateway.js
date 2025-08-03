
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert action_messages 
export async function AddActionmessages(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("action_messages", mutatedDataArray, body);
   
  return result;
}


//update action_messages 
export async function UpdateActionmessages(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("action_messages", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete action_messages 
export async function DeleteActionmessages(tokenId, whereStr)
{  
  const result = await mosySqlDelete("action_messages", whereStr);

  return result;
}

