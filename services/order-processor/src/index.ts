import { QueueClient } from '@azure/storage-queue';

type Order={id:string;email:string;customerId:string;total:number};
export function processOrder(order:Order){ return {orderId:order.id,email:order.email,customerId:order.customerId,total:order.total,message:`Order ${order.id} has been processed`}; }

async function run(){
 const conn=process.env.AZURE_STORAGE_CONNECTION_STRING; if(!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING is required');
 const inQ=new QueueClient(conn,process.env.ORDERS_QUEUE||'orders'); const outQ=new QueueClient(conn,process.env.NOTIFICATIONS_QUEUE||'notifications');
 await inQ.createIfNotExists(); await outQ.createIfNotExists();
 console.log('order-processor started');
 setInterval(async()=>{
  try{const r=await inQ.receiveMessages({numberOfMessages:5,visibilityTimeout:60}); for(const m of r.receivedMessageItems){const order=JSON.parse(Buffer.from(m.messageText,'base64').toString()) as Order; const notification=processOrder(order); await outQ.sendMessage(Buffer.from(JSON.stringify(notification)).toString('base64')); await inQ.deleteMessage(m.messageId,m.popReceipt); console.log(JSON.stringify({event:'order_processed',orderId:order.id}));}}
  catch(e){console.error('processor error',e)}
 },3000);
}
if(require.main===module) run();
