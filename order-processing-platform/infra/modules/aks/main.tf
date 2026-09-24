variable "name_prefix" { type=string }
variable "resource_group_name" { type=string }
variable "location" { type=string }
variable "acr_id" { type=string }
variable "node_count" { type=number }
variable "vm_size" { type=string }
variable "tags" { type=map(string) }
resource "azurerm_kubernetes_cluster" "aks" {
 name="${var.name_prefix}-aks"
 location=var.location
 resource_group_name=var.resource_group_name
 dns_prefix="${var.name_prefix}-aks"
 sku_tier="Free"
 identity { type="SystemAssigned" }
 default_node_pool { name="system" vm_size=var.vm_size node_count=var.node_count type="VirtualMachineScaleSets" enable_auto_scaling=true min_count=1 max_count=3 }
 network_profile { network_plugin="azure" load_balancer_sku="standard" }
 tags=var.tags
}
resource "azurerm_role_assignment" "acr_pull" { scope=var.acr_id role_definition_name="AcrPull" principal_id=azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id }
output "id" { value=azurerm_kubernetes_cluster.aks.id }
output "name" { value=azurerm_kubernetes_cluster.aks.name }
