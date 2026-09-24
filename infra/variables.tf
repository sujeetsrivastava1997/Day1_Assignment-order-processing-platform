variable "location" {
  type    = string
  default = "East US"
}

variable "resource_group_name" {
  type    = string
  default = "rg-order-processing"
}

variable "name_prefix" {
  type    = string
  default = "sujeet9242026"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "aks_node_count" {
  type    = number
  default = 1
}

variable "aks_vm_size" {
  type    = string
  default = "Standard_D2s_v7"
}

variable "tags" {
  type = map(string)

  default = {
    project    = "order-processing-platform"
    managed_by = "terraform"
  }
}
