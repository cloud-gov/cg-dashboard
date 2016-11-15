# cf-redirect

Small static app to redirect traffic from one domain to another.


## Deploy

This redirect is only deployed to govcloud.

    $ cf target -o cloud-gov -s deck
    $ cf push -f redirects/console.fr.cloud.gov/manifest.yml
