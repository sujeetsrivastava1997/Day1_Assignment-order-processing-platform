# Validation Record

The repository is structured for validation in a machine with Node.js, Docker, Azure CLI, Terraform, Helm and kubectl installed.

Recommended validation sequence:

```bash
npm install
npm test
npm run build
npm run lint
terraform -chdir=infra init -backend=false
terraform -chdir=infra fmt -check -recursive
terraform -chdir=infra validate
helm lint helm/order-processing-platform
```

The execution environment used to assemble this submission did not have access to the public npm registry, so dependency installation and live Azure deployment were not executed here. The repository therefore does not claim a live AKS deployment or Azure cost figure. Run the commands above in your network-enabled development environment and attach the resulting screenshots/logs to the submission.
