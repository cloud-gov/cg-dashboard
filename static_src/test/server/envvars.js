
const testing = process.env.TESTING || true;
const orgName = process.env.ORG_NAME || 'fake';
const specialApp = process.env.APP_NAME || false;
const specialSpaceName = process.env.SPACE_NAME || 'fake-testSpace01';

module.exports = {
  testing: testing,
  orgName: orgName,
  specialSpaceName: specialSpaceName,
  specialApp: specialApp
};
