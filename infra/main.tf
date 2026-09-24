resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

module "acr" {
  source = "./modules/acr"

  name_prefix         = var.name_prefix
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  tags                = var.tags
}

module "storage" {
  source = "./modules/storage"

  name_prefix         = var.name_prefix
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  tags                = var.tags
}

module "aks" {
  source = "./modules/aks"

  name_prefix         = var.name_prefix
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  acr_id              = module.acr.id
  node_count          = var.aks_node_count
  vm_size             = var.aks_vm_size
  tags                = var.tags

  depends_on = [module.acr]
}
