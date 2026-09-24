# Troubleshooting Evidence — ImagePullBackOff

## Injected problem

The deployment can be deliberately broken by changing the image tag in Helm from the Git commit SHA to a non-existent value such as `does-not-exist`.

Example:

```bash
helm upgrade --install order-processing ./helm/order-processing-platform \
  --set global.imageRegistry="$ACR_LOGIN_SERVER" \
  --set imageTag="does-not-exist" \
  --wait --timeout 2m
```

## Symptoms

```bash
kubectl get pods
kubectl describe pod <order-api-pod>
```

Expected symptom:

```text
STATUS: ImagePullBackOff
Reason: Failed to pull image
```

The `Events` section of `kubectl describe pod` identifies the image reference that Kubernetes could not pull.

## Root cause

The requested image tag does not exist in ACR. The pipeline publishes images using the immutable Git commit SHA, so using a different tag causes AKS to request a non-existent image.

## Fix

Get the current commit SHA:

```bash
git rev-parse HEAD
```

Confirm the image exists:

```bash
az acr repository show-tags --name "$ACR_NAME" --repository order-api --output table
```

Deploy using the existing tag:

```bash
helm upgrade --install order-processing ./helm/order-processing-platform \
  --set global.imageRegistry="$ACR_LOGIN_SERVER" \
  --set imageTag="$(git rev-parse HEAD)" \
  --wait --timeout 5m
```

Validate:

```bash
kubectl rollout status deployment/order-api
kubectl get pods
kubectl get svc order-api
```

## Preventive control

The GitHub Actions workflow always sets `IMAGE_TAG=${GITHUB_SHA}` and passes that same tag to Helm. This makes the build artifact and deployed artifact traceable to the exact Git revision.
