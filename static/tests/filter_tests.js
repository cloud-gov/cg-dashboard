describe('orgNameFilter', function () {

    var orgNameFilter;
    beforeEach(module('cfdeck'));

    beforeEach(inject(function($filter) {
        orgNameFilter = $filter('orgNameFilter');
    }));

    it('it should not break when no org is present', function() {
        expect(orgNameFilter()).toEqual();
    });

    it('it should return the org name in uppercase when the org has an entity', function() {
        expect(orgNameFilter({entity: {name: 'orgname1'}})).toEqual('ORGNAME1');
    });

    it('it should return the org name in uppercase when the org does not have entity attribute', function() {
        expect(orgNameFilter({name: 'orgname1'})).toEqual('ORGNAME1');
    });

});
