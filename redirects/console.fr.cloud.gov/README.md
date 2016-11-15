# cf-redirect

Small static app to redirect traffic from one domain to another.


## Deploy

This redirect is only deployed to govcloud.

    $ cf target -o cloud-gov -s deck
    $ cf zero-downtime-push console-redirect -f redirects/console.fr.cloud.gov/manifest.yml
