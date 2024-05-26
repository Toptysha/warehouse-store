const ROLES = require("./roles");

const ACCESS = {
  AUTH: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
    ROLES.USER,
  ],
  CATALOG: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],
  WATCH_PRODUCTS: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],
  EDIT_PRODUCTS: [ROLES.ADMIN, ROLES.EDITOR, ROLES.SELLER_ONLINE],
  DELETE_PRODUCTS: [ROLES.ADMIN, ROLES.EDITOR, ROLES.SELLER_ONLINE],

  USERS: [ROLES.ADMIN],
  LOGS: [ROLES.ADMIN, ROLES.EDITOR],
};

module.exports = ACCESS;
