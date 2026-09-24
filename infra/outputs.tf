output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "acr_name" {
  value = module.acr.name
}

output "acr_login_server" {
  value = module.acr.login_server
}

output "aks_name" {
  value = module.aks.name
}

output "aks_resource_group" {
  value = azurerm_resource_group.rg.name
}

output "storage_connection_string" {
  value     = module.storage.connection_string
  sensitive = true
}

output "storage_account_name" {
  value = module.storage.account_name
}
