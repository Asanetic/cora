import puppeteer from 'puppeteer';
import { magicRandomStr, mosyQddata } from '../../apiUtils/dataControl/dataUtils.js';
import { appendParamsToUrl, nextTaskMarket } from '../corav2_custom_functions.js';

async function abortCurrentTask(taskId){
  const taskData = await mosyQddata("advert_tasktray","record_id", taskId);
  const mkId = taskData?.active_market

  if(mkId=="Aborted")
  {
    return true
  }else{
    return false
  }

}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("task_id");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg) => {
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
      };

      let currentTaskId = taskId;
      let taskCount = 1;

      while (currentTaskId) {
        send(`▶️ Starting task ${taskCount}...`);

        const result = await runPost(currentTaskId, send);

        if (result?.endTask) {
          send("✅ Posting complete. All tasks done.");
          break;
        }

        send("🔁 Executing next post ...");

        currentTaskId = taskId || null; // <- You need this logic in `runPost`
        taskCount++;
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}


async function runPost(taskId, send)
{
    
    try {

    send(`Gathering task data for task id ${taskId}...`)
    await new Promise(res => setTimeout(res, 4000));

    //task attr
    const taskData = await mosyQddata("advert_tasktray","record_id", taskId);
    const mkId = taskData?.active_market
    const taskName = taskData?.task_name
    const agentId= taskData?.agent_name        
    const campaignId = taskData?.active_campaign
    const marketType = taskData?.platform_target
    const browserType = taskData?.headless

    let headlessStatus=true 
    if(browserType=="false")
    {
      headlessStatus=false
    }

    console.log(`taskData`, taskData)

    //campaign data
    const campaignData = await mosyQddata("campaigns", "record_id", campaignId)
    const campaignDetails = campaignData?.post_content
    const landingPageId = campaignData?.landing_page

    send(`Task ${taskName} found\nPost ${campaignData?.post_title}`)

    //agent data
    const agentData = await mosyQddata("advert_agents","record_id", agentId)
    const agentCookies = agentData?.config_info

    send(`Agent found ${agentData?.agent_name}`);

    //landing page data 
    const landingPageData = await mosyQddata("landing_pages","record_id", landingPageId)
    const landingPageUrl = landingPageData?.url

    const landingPageAnalyticsUrl =  appendParamsToUrl(landingPageUrl, {
        ma: mkId,
        tid: taskId,
      });
    
    const urlEmbededPost = `${campaignDetails}\n${landingPageAnalyticsUrl}`
    send(`Campaign ${urlEmbededPost}`)


    //audience data
    const audienceData = await mosyQddata("audience", "record_id", mkId)
    const audienceUrl = audienceData?.pageurl
    const marketName = audienceData?.pagename 

    if(mkId=="Finished")
    {

      send(`Task complete. No more market in audience list ${mkId}`)

      return { endTask: true }; // gracefully move on 

    }


    //exit strategy 
    const exitData = {
      taskId: taskId,
      mkId: mkId,
      campaignId: campaignId,
      landingPageId: landingPageId,
      mkturl: audienceUrl,
      post_status: "Onprogress",
      mktype : marketType
    }    

    //catch abort 
    const earlyAbort = await abortCurrentTask(taskId)
    if(earlyAbort)
    {

      send("❌ Schedule cancelled by user")
      exitData.post_status="Aborted"
      exitData.screenshotPath="na";
  
      await nextTaskMarket(exitData); 

      return { endTask: true }; // gracefully move on 
    }

    send('🚀 Launching browser...');

    const browser = await puppeteer.launch({
      headless: headlessStatus, // can be true or false, depending on how you're debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();


    //const cookies = agentCookies //require('./fbcookie.js');
    const cookies = JSON.parse(agentCookies);

    await page.setCookie(...cookies);
    send(`🔐 Cookies set. Loggin is as ${agentData?.agent_name}`);

    const pageUrl = `${audienceUrl}`;
    send(`🌐 Navigating to: ${marketName} - ${pageUrl} `);
    await page.goto(pageUrl, { waitUntil: 'networkidle2',  timeout: 60000 });

    const triggerAllowCookies = await page.evaluate(() => {
      const phrases = ["Decline optional cookies"]; // Add more as needed
    
      const clickableTags = ["button", "a", "span", "div", "p"];
    
      for (const tag of clickableTags) {
        const elements = Array.from(document.querySelectorAll(tag));
        for (const phrase of phrases) {
          const match = elements.find(el => el.textContent?.toLowerCase().includes(phrase.toLowerCase()));
          if (match) {
            match.click();
            return { clicked: true, tag, text: match.textContent.trim() };
          }
        }
      }
    
      return { clicked: false };
    });

    if (triggerAllowCookies.clicked) {
      send(`✅ Clicked '${triggerAllowCookies.text}' on a <${triggerAllowCookies.tag}>`);
    } else {
      send("ℹ️ Allow cookies not found. Continuing...");
    }

    send(" >> Preparing next sequence...");

    await new Promise(res => setTimeout(res, 4500));


    send('🧠 Waiting for "What\'s on your mind?" trigger...');
    const triggerClicked = await page.evaluate(() => {
      const phrases = [
        "What's on your mind",
        "Write something",
        "Share something",
        "Sell something",
        "Create post",
        "Post something",
        "Say something",
        "Express yourself"
      ];

      const spans = Array.from(document.querySelectorAll('span'));
      for (const phrase of phrases) {
        const postTrigger = spans.find(span => span.textContent?.toLowerCase().includes(phrase.toLowerCase()));
        if (postTrigger) {
          postTrigger.click();
          return true;
        }
      }
      return false;
    });

    if (!triggerClicked){
      send('Could not find post box');
      const postScreenShot = `storage/media/posting_activity/error_no_post_box_${magicRandomStr(10)}_post_.png`;
      await page.screenshot({ path: postScreenShot });
      
      exitData.screenshotPath = postScreenShot
      exitData.post_status="No post box"
  
      await nextTaskMarket(exitData); 
      await browser.close();

      return { endTask: false }; // gracefully move on 
    } 

    send('✏️ Post input area triggered.');

    await page.waitForSelector('div[role="dialog"] div[contenteditable="true"]', {
      visible: true,
      timeout: 30000
    });

    const postText = urlEmbededPost;

    const abortTyping = await abortCurrentTask(taskId)
    if(abortTyping)
    {

      send("❌ Typing aborted")
      exitData.screenshotPath="";
      exitData.post_status="Cancelled by User"
  
      await nextTaskMarket(exitData); 
      await browser.close();

      return { endTask: true }; // gracefully move on 
    }

    send('...');

    const postBox = await page.$('div[role="dialog"] div[contenteditable="true"]');
    let shouldAbortTyping = await abortCurrentTask(taskId); // or use a signal/callback for real-time control
    
    for (let i = 0; i < postText.length; i++) {
     const typed = postText[i]

      send(`::update::${typed}`);

      if (shouldAbortTyping) {
        send("❌ Typing cancelled midway.");
        break;
      }
    
      await postBox.type(postText[i], { delay: 50 });
    }

    send(`✅ Finished typing.`);

    send('Preparing to post...');

    await new Promise(res => setTimeout(res, 4500));

    const nextHandles = await page.$$('span');
    let nextClicked = false;
    for (const handle of nextHandles) {
      const text = await page.evaluate(el => el.textContent, handle);
      if (text && text.includes('Next')) {
        await handle.click();
        send("✅ Next button clicked.");
        nextClicked = true;
        break;
      }
    }
    if (!nextClicked) send("ℹ️ Next button not found. Skipping to Post button.");

    await new Promise(res => setTimeout(res, 3000));

    const abortTask = await abortCurrentTask(taskId)
    if(abortTask)
    {

      send("❌ Posting aborted")
      exitData.screenshotPath="";
      exitData.post_status="Cancelled by user"
  
      await nextTaskMarket(exitData); 
      await browser.close();

      return { endTask: true }; // gracefully move on 
    }

    const postClicked = await page.evaluate(() => {
      const buttons = document.querySelectorAll('div[role="button"] span');
      for (let btn of buttons) {
        if (btn.innerText.trim() === 'Post') {
          btn.click();
          return true;
        }
      }
      return false;
    });

    if (!postClicked){
      send("❌ Could not find the Post button.")

      const postScreenShot = `storage/media/posting_activity/error_no_post_btn_${magicRandomStr(10)}_post_.png`;
      await page.screenshot({ path: postScreenShot });
      
      exitData.screenshotPath = postScreenShot
      exitData.post_status="Not post btn"
  
      await nextTaskMarket(exitData); 
      await browser.close();

      return { endTask: false }; // gracefully move on 
    }

    await new Promise(res => setTimeout(res, 3900));
    await page.mouse.click(10, 10);

    send('⏳ Waiting to confirm post...');
    await new Promise(res => setTimeout(res, 3000));

    const postScreenShot = `storage/media/posting_activity/${magicRandomStr(10)}_post_.png`;
    await page.screenshot({ path: postScreenShot });
    
    send(`📸 Screenshot taken: ${postScreenShot}`);


    await browser.close();
    send('✅ Post submitted successfully!');

    send(`Scheduling the next task ... `)
    
    exitData.screenshotPath = postScreenShot
    exitData.post_status="Posted"

    await nextTaskMarket(exitData);      

    send(`Task complete. Next task running ... `)

    return { endTask: false }; // or false

} catch (err) {
    send(`❌ ERROR: ${err.message}`);

    return { endTask: false }; // or false

   // controller.close();
  }    
}

