variable "name_prefix" { type=string }
variable "resource_group_name" { type=string }
variable "location" { type=string }
variable "tags" { type=map(string) }
resource "azurerm_storage_account" "storage" {
 name=replace("${var.name_prefix}storage","-","")
 resource_group_name=var.resource_group_name
 location=var.location
 account_tier="Standard"
 account_replication_type="LRS"
 min_tls_version="TLS1_2"
 tags=var.tags
}
resource "azurerm_storage_table" "orders" { name="orders" storage_account_name=azurerm_storage_account.storage.name }
resource "azurerm_storage_queue" "orders" { name="orders" storage_account_name=azurerm_storage_account.storage.name }
resource "azurerm_storage_queue" "notifications" { name="notifications" storage_account_name=azurerm_storage_account.storage.name }
output "account_name" { value=azurerm_storage_account.storage.name }
output "connection_string" { value=azurerm_storage_account.storage.primary_connection_string sensitive=true }
