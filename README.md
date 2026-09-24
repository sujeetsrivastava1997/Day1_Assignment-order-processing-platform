# Order Processing Platform

A cloud-native Order Processing Platform built with TypeScript microservices, Docker, Terraform, Azure Container Registry (ACR), Azure Kubernetes Service (AKS), Azure Storage, Helm, and GitHub Actions.

## Architecture

```text
                         GitHub Repository
                                |
                                v
                         GitHub Actions
                                |
                    +-----------+-----------+
                    |                       |
                Build/Test             Docker Build
                    |                       |
                    +-----------+-----------+
                                |
                                v
                    Azure Container Registry
                                |
                                v
                     Azure Kubernetes Service
                                |
              +-----------------+-----------------+
              |                 |                 |
              v                 v                 v
         Order API       Order Processor    Notification
              |                 |                 |
              +-----------------+-----------------+
                                |
                                v
                         Azure Storage
                    +-----------+-----------+
                    |           |           |
                 Orders      Orders   Notifications
                  Table      Queue        Queue
```

## Services

### Order API
REST API responsible for accepting orders.

Endpoints:

- `GET /health`
- `POST /orders`

### Order Processor
Background service responsible for processing orders using Azure Storage.

### Notification Service
Consumes notification messages and performs notification processing.

## Technology Stack

- Node.js 20
- TypeScript
- Express
- Docker
- Kubernetes
- Helm
- Terraform
- Azure Kubernetes Service (AKS)
- Azure Container Registry (ACR)
- Azure Storage
- GitHub Actions

## Azure Infrastructure

Infrastructure is provisioned using Terraform.

Resources include:

- Azure Resource Group
- Azure Container Registry
- Azure Storage Account
- Azure Storage Table
- Azure Storage Queues
- Azure Kubernetes Service
- AKS managed identity
- ACR `AcrPull` role assignment

### Environment

| Resource | Value |
|---|---|
| Resource Group | `rg-order-processing` |
| ACR | `sujeet9242026acr` |
| ACR Login Server | `sujeet9242026acr.azurecr.io` |
| AKS | `sujeet9242026-aks` |
| Region | East US |
| AKS Node SKU | `Standard_D2s_v7` |

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COST_OPTIMIZATION.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── helm/
│   └── order-processing-platform/
├── infra/
│   └── modules/
├── services/
│   ├── order-api/
│   ├── order-processor/
│   └── notification-service/
└── README.md
```

## Infrastructure Deployment

```bash
cd infra

terraform init
terraform plan
terraform apply
```

## Docker Images

The three services are containerized independently and stored in Azure Container Registry.

```text
sujeet9242026acr.azurecr.io/order-api
sujeet9242026acr.azurecr.io/order-processor
sujeet9242026acr.azurecr.io/notification-service
```

## AKS Deployment

Retrieve AKS credentials:

```bash
az aks get-credentials \
  --resource-group rg-order-processing \
  --name sujeet9242026-aks \
  --overwrite-existing
```

Deploy the application with Helm:

```bash
helm upgrade --install order-processing \
  ./helm/order-processing-platform
```

## Kubernetes

The Helm chart deploys:

- Order API
- Order Processor
- Notification Service
- Kubernetes Services
- Application configuration
- Storage connection configuration

The Order API is exposed using an Azure LoadBalancer.

## CI/CD

The GitHub Actions workflow is located at:

```text
.github/workflows/ci-cd.yml
```

The pipeline is designed to perform:

1. Checkout source code
2. Install dependencies
3. Build services
4. Run tests
5. Build Docker images
6. Tag images using the Git commit SHA
7. Push images to Azure Container Registry
8. Authenticate with Azure
9. Retrieve AKS credentials
10. Deploy using Helm
11. Validate Kubernetes rollouts

### Required GitHub Secrets

```text
AZURE_CREDENTIALS
ACR_NAME
ACR_LOGIN_SERVER
STORAGE_CONNECTION_STRING
```

Secrets should never be committed to the repository.

## Security

- AKS uses a managed identity.
- AKS has `AcrPull` permission for the private ACR.
- Storage connection information is supplied through deployment configuration.
- GitHub Actions sensitive values are intended to be stored as repository secrets.
- No passwords, access tokens, or storage credentials should be committed to source control.

## Troubleshooting Evidence

### AKS VM SKU Restriction

The initial `Standard_B2s` VM size was rejected by Azure for the subscription in East US.

The node size was changed to:

```text
Standard_D2s_v7
```

After the change, AKS was created successfully.

### InvalidImageName

The initial Helm chart contained the placeholder registry:

```text
REPLACE_ME
```

It was replaced with:

```text
sujeet9242026acr.azurecr.io
```

The workloads were then able to use the ACR images.

### Azure Storage Configuration

Order Processor and Notification Service require:

```text
AZURE_STORAGE_CONNECTION_STRING
```

The value is supplied through deployment configuration rather than committed to source control.

## Cost Optimization

Practical cost optimization opportunities include:

1. **Right-size AKS nodes**  
   Use an appropriate VM SKU for the workload instead of unnecessarily large nodes.

2. **Use cluster autoscaling**  
   Configure minimum and maximum node counts so AKS can scale based on demand.

3. **Stop non-production resources when unused**  
   Development/demo environments can be scaled down or removed when not required.

4. **Manage ACR images**  
   Use immutable SHA-based tags and periodically remove obsolete images.

5. **Control Storage retention**  
   Review queue/table usage and apply appropriate retention and lifecycle policies.

## Deployment Evidence

The following environment components were successfully provisioned and deployed during the assignment:

- Terraform-managed Azure infrastructure
- Azure Container Registry
- Azure Storage
- Azure Kubernetes Service
- Dockerized application services
- Helm deployment
- Kubernetes workloads

The deployed Kubernetes workloads reached:

```text
Order API              1/1 Running
Order Processor        1/1 Running
Notification Service   1/1 Running
```

The Order API was exposed through an Azure LoadBalancer.

## Assignment Deliverables

| Requirement | Status |
|---|---|
| Microservices | Completed |
| Docker | Completed |
| Terraform | Completed |
| Azure Container Registry | Completed |
| Azure Storage | Completed |
| Azure Kubernetes Service | Completed |
| Helm | Completed |
| Kubernetes deployment | Completed |
| GitHub Actions workflow | Completed |
| Architecture documentation | Completed |
| Cost optimization | Completed |
| Troubleshooting documentation | Completed |
| GitHub repository | Completed |

## Project Repository

GitHub repository:

https://github.com/sujeetsrivastava1997/Day1_Assignment-order-processing-platform
