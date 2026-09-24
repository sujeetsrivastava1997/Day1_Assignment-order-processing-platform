variable "name_prefix" { type=string }
variable "resource_group_name" { type=string }
variable "location" { type=string }
variable "tags" { type=map(string) }
resource "azurerm_container_registry" "acr" {
 name=replace("${var.name_prefix}acr","-","")
 resource_group_name=var.resource_group_name
 location=var.location
 sku="Basic"
 admin_enabled=false
 tags=var.tags
}
output "id" { value=azurerm_container_registry.acr.id }
output "name" { value=azurerm_container_registry.acr.name }
output "login_server" { value=azurerm_container_registry.acr.login_server }
