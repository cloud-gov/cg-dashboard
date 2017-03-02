# cf-redirect

Small static app to redirect traffic from one domain to another.


## Deploy

This redirect is deployed to east/west and govcloud.

Govcloud redirects console.fr.cloud.gov -> dashboard.fr.cloud.gov

    $ cf target -o cloud-gov -s deck
    $ cf zero-downtime-push console-redirect -f redirects/cg-deck/manifest-govcloud.yml

East/west redirects console.cloud.gov -> dashboard.cloud.gov

    $ cf target -o cf -s dashboard-prod
    $ cf zero-downtime-push console-redirect -f redirects/cg-deck/manifest-ew.yml
