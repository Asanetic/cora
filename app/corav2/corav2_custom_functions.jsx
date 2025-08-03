"use client";
import { useEffect, useState, useRef } from "react";

import { MosyAlertCard } from "../MosyUtils/ActionModals";
import { MosyCard } from "../components/MosyCard";

import {mosyGetData} from '../MosyUtils/hiveUtils'

export function runCampaign(task_id)
{
  MosyAlertCard({message:"Run this campaign", yesLabel:"Run", onYes :()=>{exePost(task_id)} , icon:"copy"})  
}

export function exePost(task_id)
{
  MosyCard("Cora social media assistant",<LiveStatus taskId={task_id}/>,true,"modal1","mosycard_medium")
}

export  function LiveStatus({taskId}) {
  const [log, setLog] = useState([]);
  const logEndRef = useRef(null);

  useEffect(() => {
    const es = new EventSource(`/api/corav2/streamtask?task_id=${taskId}`);

    es.onmessage = (e) => {
      const msg = e.data;
    
      if (msg.startsWith('::update::')) {
        const content = msg.replace('::update::', '');
    
        setLog((prev) => {
          const newLog = [...prev];
    
          // Append character(s) to the last line, keeping everything that was already there
          const currentLine = newLog[newLog.length - 1] || '⌨️ Typing: ';
          const alreadyTyped = currentLine.replace('⌨️ Typing: ', '');
    
          newLog[newLog.length - 1] = `⌨️ Typing: ${alreadyTyped + content}`;
          return newLog;
        });
      } else {
        // Start a new log line normally
        setLog((prev) => [...prev, msg]);
      }
    };  
    
    es.onerror = (error) => {
      //console.error(`SSE failed ${error}`);
      es.close();
    };

    return () => es.close();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const handleClear = () => setLog([]);
  const handleAbort= () => {
    setLog((prev) => [...prev, `Attempting to cancel...`]);
    mosyGetData({endpoint:`/api/corav2/streamtask/abort?task_id=${taskId}`})
  };

  return (
    <div className="card rounded-4 border-0">
      <div className="card-header bg-light d-flex justify-content-between align-items-center rounded-top-4">
        <strong>📡 Posting progress</strong>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={handleClear}
        >
          Clear
        </button>

        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleAbort}
        >
          Cancel task
        </button>        
      </div>

      <div
        className="card-body bg-black  font-monospace"
        style={{
          height: "320px",
          overflowY: "auto",
          fontSize: "0.9rem",
          whiteSpace: "pre-wrap",
          borderBottomLeftRadius: "1rem",
          borderBottomRightRadius: "1rem",
        }}
      >
        {log.length === 0 && (
          <div className="text-muted">Waiting for stream...</div>
        )}

          {log.map((line, i) => {
            const isLast = i === log.length - 1;
            const isDone = /task finished|✅/i.test(line); // tweak regex as needed
            const showSpinner = isLast && !isDone;

            return (
              <div
                key={i}
                className="col-md-12 text-left texxt-dark p-2 border-bottom d-flex align-items-center"
              >
                <span className="me-2">
                  {showSpinner ? (
                    <i className="fa fa-spinner fa-spin text-danger  mr-2" />
                  ) : (
                    <i className="fa fa-check-circle text-success  mr-2" />
                  )}
                </span>
                <span>{line}</span>
              </div>
            );
          })}


        <div ref={logEndRef} />
      </div>
    </div>
  );
}


