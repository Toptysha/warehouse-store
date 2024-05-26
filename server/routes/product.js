const express = require("express");
const {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
} = require("../controllers/product");
const {
  addPhotos,
  getCovers,
  getCover,
  getMeasurements,
  deletePhoto,
} = require("../controllers/photos");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ACCESS = require("../constants/access");
const mapProduct = require("../helpers/mapProduct");

const multer = require("multer");

const upload = multer();

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  authenticated,
  hasRole(ACCESS.EDIT_PRODUCTS),
  async (req, res) => {
    try {
      const newProduct = await addProduct({
        article: req.body.article,
        brand: req.body.brand,
        name: req.body.name,
        color: req.body.color,
        price: req.body.price,
        sizes: req.body.sizes,
      });

      res.send({ data: newProduct });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/",
  authenticated,
  hasRole(ACCESS.WATCH_PRODUCTS),
  async (req, res) => {
    try {
      const { products, lastPage } = await getProducts(
        req.query.search,
        req.query.limit,
        req.query.page
      );
      const coversUrls = await getCovers(products);
      res.send({
        error: null,
        data: { products: products.map(mapProduct), coversUrls, lastPage },
      });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/:id",
  authenticated,
  hasRole(ACCESS.WATCH_PRODUCTS),
  async (req, res) => {
    try {
      const product = await getProduct(req.params.id);
      const coversUrls = await getCover(req.params.id);
      const measurementsUrls = await getMeasurements(req.params.id);
      res.send({
        error: null,
        data: { product: mapProduct(product), coversUrls, measurementsUrls },
      });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole(ACCESS.DELETE_PRODUCTS),
  async (req, res) => {
    try {
      await deleteProduct(req.params.id);
      res.send({ error: null, data: "Product was deleted" });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.patch(
  "/:id",
  authenticated,
  hasRole(ACCESS.EDIT_PRODUCTS),
  async (req, res) => {
    if (req.body.covers) {
      try {
        await addPhotos(req.params.id, {
          covers: req.body.covers,
          measurements: req.body.measurements,
        });
        res.send({ data: "Photos was updated" });
      } catch (err) {
        res.send({ error: err.message || "Unknown Error" });
      }
    } else {
      try {
        const updatedProduct = await editProduct(req.params.id, {
          brand: req.body.brand,
          name: req.body.name,
          color: req.body.color,
          price: req.body.price,
          sizes: req.body.sizes,
        });
        res.send({ data: updatedProduct });
      } catch (err) {
        console.log("TEST0", err);
        res.send({ error: err.message || "Unknown Error" });
      }
    }
  }
);

router.post(
  "/photos",
  authenticated,
  hasRole(ACCESS.EDIT_PRODUCTS),
  upload.any(),
  async (req, res) => {
    try {
      await addPhotos({
        photos: req.files,
        folder: req.body.folder,
        typePhotos: req.body.typePhotos,
        currentSize: req.body.currentSize,
      });
      res.send({ data: "Success" });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.post(
  "/delete-photo",
  authenticated,
  hasRole(ACCESS.DELETE_PRODUCTS),
  async (req, res) => {
    try {
      await deletePhoto({
        fileName: req.body.fileName,
        sizeName: req.body.sizeName,
        typeOfPhoto: req.body.typeOfPhoto,
        id: req.body.id,
      });
      res.send({ data: "Photo was deleted" });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

module.exports = router;
