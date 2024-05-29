const express = require("express");

const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ACCESS = require("../constants/access");
const { addOrder, getOrders, getOrder } = require("../controllers/order");
const mapOrder = require("../helpers/mapOrder");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  authenticated,
  hasRole(ACCESS.EDIT_ORDERS),
  async (req, res) => {
    try {
      const newOrder = await addOrder({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        delivery: req.body.delivery,
        orders: req.body.orders,
        deliveryPrice: req.body.deliveryPrice,
        totalPrice: req.body.totalPrice,
        author: req.user._id,
      });

      res.send({ data: newOrder });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/",
  authenticated,
  hasRole(ACCESS.WATCH_ORDERS),
  async (req, res) => {
    try {
      const { orders, lastPage } = await getOrders(
        req.query.search,
        req.query.limit,
        req.query.page
      );
      res.send({
        error: null,
        data: { orders: orders.map(mapOrder), lastPage },
      });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/:id",
  authenticated,
  hasRole(ACCESS.WATCH_ORDERS),
  async (req, res) => {
    try {
      const order = await getOrder(req.params.id);
      res.send({ data: mapOrder(order) });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

// router.delete(
//   "/:id",
//   authenticated,
//   hasRole(ACCESS.DELETE_orderS),
//   async (req, res) => {
//     try {
//       await deleteorder(req.params.id);
//       res.send({ error: null, data: "order was deleted" });
//     } catch (err) {
//       res.send({ error: err.message || "Unknown Error" });
//     }
//   }
// );

// router.patch(
//   "/:id",
//   authenticated,
//   hasRole(ACCESS.EDIT_orderS),
//   async (req, res) => {
//     if (req.body.covers) {
//       try {
//         await addPhotos(req.params.id, {
//           covers: req.body.covers,
//           measurements: req.body.measurements,
//         });
//         res.send({ data: "Photos was updated" });
//       } catch (err) {
//         res.send({ error: err.message || "Unknown Error" });
//       }
//     } else {
//       try {
//         const updatedorder = await editorder(req.params.id, {
//           delivery: req.body.delivery,
//           name: req.body.name,
//           address: req.body.address,
//           orders: req.body.orders,
//           deliveryPrice: req.body.deliveryPrice,
//         });
//         res.send({ data: updatedorder });
//       } catch (err) {
//         console.log("TEST0", err);
//         res.send({ error: err.message || "Unknown Error" });
//       }
//     }
//   }
// );

// router.post(
//   "/photos",
//   authenticated,
//   hasRole(ACCESS.EDIT_orderS),
//   upload.any(),
//   async (req, res) => {
//     try {
//       await addPhotos({
//         photos: req.files,
//         folder: req.body.folder,
//         typePhotos: req.body.typePhotos,
//         currentSize: req.body.currentSize,
//       });
//       res.send({ data: "Success" });
//     } catch (err) {
//       res.send({ error: err.message || "Unknown Error" });
//     }
//   }
// );

// router.post(
//   "/delete-photo",
//   authenticated,
//   hasRole(ACCESS.DELETE_orderS),
//   async (req, res) => {
//     try {
//       await deletePhoto({
//         fileName: req.body.fileName,
//         sizeName: req.body.sizeName,
//         typeOfPhoto: req.body.typeOfPhoto,
//         id: req.body.id,
//       });
//       res.send({ data: "Photo was deleted" });
//     } catch (err) {
//       res.send({ error: err.message || "Unknown Error" });
//     }
//   }
// );

module.exports = router;
