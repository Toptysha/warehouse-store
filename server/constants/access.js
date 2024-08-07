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
  EDIT_PRODUCTS: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],
  DELETE_PRODUCTS: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],

  WATCH_ORDERS: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],
  EDIT_ORDERS: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],

  USERS: [ROLES.ADMIN],

  GET_USER: [
    ROLES.ADMIN,
    ROLES.EDITOR,
    ROLES.SELLER_ONLINE,
    ROLES.SELLER_ON_STORE,
  ],
  LOGS: [ROLES.ADMIN, ROLES.EDITOR],

  WATCH_SCHEDULE: [ROLES.ADMIN, ROLES.EDITOR, ROLES.SELLER_ONLINE],

  EDIT_SCHEDULE: [ROLES.ADMIN, ROLES.EDITOR, ROLES.SELLER_ONLINE],
};

module.exports = ACCESS;
