import { UpdatePostactivity } from '../../advert_tasktray/postactivity/PostactivityDbGateway'

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("task_id");

    UpdatePostactivity("",{"active_market":"Aborted"},{},{},`record_id ='${taskId}'`)
    
}    