import fs from 'fs';
import path from 'path';

let fnames = [];
let lnames = [];

function loadNamesOnce() {
  if (fnames.length === 0 || lnames.length === 0) {
    const fnamePath = path.join(process.cwd(), 'public', 'fname.txt');
    const lnamePath = path.join(process.cwd(), 'public', 'lname.txt');

    fnames = fs.readFileSync(fnamePath, 'utf-8').split('\n').map(n => n.trim()).filter(Boolean);
    lnames = fs.readFileSync(lnamePath, 'utf-8').split('\n').map(n => n.trim()).filter(Boolean);
  }
}

function getRandomName() {
  const first = fnames[Math.floor(Math.random() * fnames.length)];
  const last = lnames[Math.floor(Math.random() * lnames.length)];
  return `${first}_${last}_${Date.now()}`;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow from ANY domain
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function GET() {
  loadNamesOnce();
  const name = getRandomName();
  return new Response(JSON.stringify({ name }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
