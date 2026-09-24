# Architecture Diagram

```mermaid
flowchart TB
    Developer[Developer] --> GitHub[GitHub Repository]
    GitHub --> Actions[GitHub Actions CI/CD]
    Actions --> Tests[Unit Tests + Lint + Terraform Validate]
    Tests --> Build[Docker Build]
    Build --> Scan[Trivy CRITICAL/HIGH Scan]
    Scan --> ACR[Azure Container Registry]
    ACR --> AKS[Azure Kubernetes Service]
    Actions -->|Helm + immutable SHA tag| AKS
    Client[Client] --> API[Order API]
    API --> Table[Azure Table Storage\nOrders]
    API --> OrdersQ[Azure Queue\norders]
    OrdersQ --> Processor[Order Processor]
    Processor --> NotifyQ[Azure Queue\nnotifications]
    NotifyQ --> Notification[Notification Service]
```

## Design rationale

The API is synchronous only at the edge. Internal processing is asynchronous. Queue boundaries provide loose coupling, retry capability through queue visibility timeouts, and independent scaling of worker services.
