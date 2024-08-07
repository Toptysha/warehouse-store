const LOG_ACTIONS = {
  PRODUCT_ACTIONS: {
    ADD: "productAdd",
    UPDATE_INFO: "productUpdateInfo",
    ADD_PHOTOS: "productAddPhotos",
    REMOVE_PHOTOS: "productRemovePhotos",
    REMOVE: "productRemove",
  },
  ORDER_ACTIONS: {
    ADD: "orderAdd",
    UPDATE: "orderUpdate",
    CANCEL: "orderCancel",
    CANCEL_CANCELLATION: "orderCancelCancellation",
  },
  USER_ACTIONS: {
    UPDATE_ROLE: "updateUserRole",
    DELETE: "deleteUser",
  },
};

module.exports = LOG_ACTIONS;
