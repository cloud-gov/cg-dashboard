(function() {
    // Show an org name 
    angular.module('cfdeck').filter('orgNameFilter', function() {
        return function(org) {
            if (org) {
                if (org.entity)
                    return org.entity.name.toUpperCase();
                else
                    return org.name.toUpperCase();
            }
        };
    });
}());
