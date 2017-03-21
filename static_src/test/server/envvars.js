
const testing = process.env.TESTING || true;
const orgName = process.env.ORG_NAME || 'fake';
const onlyOrgUserName = process.env.ORG_USER_NAME || false;
const noSpaceUsers = process.env.NO_SPACE_USERS || false;

module.exports = {
  onlyOrgUserName,
  noSpaceUsers,
  testing,
  orgName
};
