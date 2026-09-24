# Azure Cost Management Review

This lab is intentionally small, so the main cost drivers are the AKS compute node(s), load balancer/public IP, container registry, and storage. Actual charges depend on Azure region, usage, support plan, taxes, and the subscription's pricing agreement.

## Baseline assumptions

- AKS uses one small `Standard_B2s` node with cluster autoscaling allowed from 1 to 3 nodes.
- ACR uses the Basic SKU.
- Storage uses Standard LRS.
- The workload is a development/lab workload, not production.

## Optimization opportunities

| Area | Action | Why it helps | Trade-off |
|---|---|---|---|
| AKS compute | Keep dev/test node pool at the smallest workload-appropriate VM size and use autoscaling | Avoid paying for idle CPU/memory | Too-small nodes can cause scheduling pressure |
| Dev/test schedule | Stop/deallocate non-production compute outside working hours or destroy the lab after evaluation | Removes idle compute cost | Environment is unavailable while stopped |
| ACR | Use Basic for this lab and configure image retention/cleanup | Avoids paying for unnecessary registry capacity and stale images | Aggressive cleanup can remove rollback images |
| Storage | Keep LRS for non-critical lab data and add lifecycle rules when blob data is introduced | LRS is cheaper than geo-redundant options; lifecycle rules reduce retained data | Less geographic redundancy |
| Observability | Set sensible Log Analytics retention and avoid verbose application logs | Log ingestion/retention can become a hidden cost | Less historical troubleshooting data |
| Scaling | Set realistic HPA/cluster autoscaler boundaries | Prevents accidental scale-out | May delay capacity during unexpected load |

## Cost review procedure

1. Open **Azure Portal → Cost Management + Billing → Cost analysis**.
2. Scope the analysis to the assignment resource group.
3. Set a daily/monthly time range and group by **Service name** and **Resource**.
4. Compare actual cost against the expected lab usage.
5. Create a budget alert for the lab resource group.
6. Delete the resource group after the assessment if the environment is no longer needed.

## Evidence to capture for submission

Take screenshots showing:

- Cost Analysis grouped by service.
- A budget and alert threshold.
- AKS node pool size/autoscaler configuration.
- ACR SKU.
- Storage account redundancy setting.

These screenshots should be added to the final submission because Azure charges are subscription- and region-specific and cannot be truthfully represented by a fixed number in this repository.
