import express from 'express';
import crypto from 'node:crypto';
import { getQueueClient, getTableClient } from './storage';

export type Order = { id:string; customerId:string; items:{sku:string;quantity:number}[]; total:number; email:string; status:string; createdAt:string };

export function createApp(deps?: {send:(message:string)=>Promise<void>; save:(order:Order)=>Promise<void>}) {
  const app=express(); app.use(express.json());
  app.get('/health',(_req,res)=>res.json({status:'ok',service:'order-api'}));
  app.post('/orders',async(req,res)=>{
    try {
      const {customerId,items,total,email}=req.body ?? {};
      if(!customerId || !Array.isArray(items) || items.length===0 || typeof total!=='number' || !email) return res.status(400).json({error:'customerId, items, total and email are required'});
      const order:Order={id:crypto.randomUUID(),customerId,items,total,email,status:'RECEIVED',createdAt:new Date().toISOString()};
      if(deps){ await deps.save(order); await deps.send(JSON.stringify(order)); }
      else {
        const table=getTableClient(); await table.createTable().catch(()=>{});
        await table.upsertEntity({partitionKey:'orders',rowKey:order.id,...order},'Replace');
        const q=getQueueClient(process.env.ORDERS_QUEUE || 'orders'); await q.createIfNotExists(); await q.sendMessage(Buffer.from(JSON.stringify(order)).toString('base64'));
      }
      return res.status(201).json(order);
    } catch(e){ console.error(e); return res.status(500).json({error:'failed to create order'}); }
  });
  return app;
}

const app=createApp();
if(require.main===module){const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`order-api listening on ${port}`));}
