import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import { QueueClient } from '@azure/storage-queue';

export function getQueueClient(queueName: string): QueueClient {
  const connection = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connection) throw new Error('AZURE_STORAGE_CONNECTION_STRING is required');
  return new QueueClient(connection, queueName);
}

export function getTableClient(): TableClient {
  const connection = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connection) throw new Error('AZURE_STORAGE_CONNECTION_STRING is required');
  return TableClient.fromConnectionString(connection, 'orders');
}
