const express = require("express");
const {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
  getProductByArticle,
} = require("../controllers/product");
const {
  addPhotos,
  getCovers,
  getCover,
  getMeasurements,
  deletePhoto,
} = require("../controllers/photos");
const {
  addProductLog,
  deleteProductLog,
  changeProductInfoLog,
  addProductPhotosLog,
  removeProductPhotosLog,
  deleteAllLogs,
} = require("../controllers/log");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ACCESS = require("../constants/access");
const mapProduct = require("../helpers/mapProduct");

const multer = require("multer");
const { checkProductChanges } = require("../utils/check-product-changes");

const upload = multer();

const router = express.Router({ mergeParams: true });

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

// fake post по факту get
router.post(
  "/article",
  authenticated,
  hasRole(ACCESS.WATCH_PRODUCTS),
  async (req, res) => {
    try {
      const products = await getProductByArticle(req.body.partOfArticle);
      const coversUrls = await getCovers(products);
      res.send({
        error: null,
        data: {
          products: products.map(mapProduct),
          coversUrls,
        },
      });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

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
        author: {
          connect: { id: req.user.id },
        },
      });

      await addProductLog(req.user.id, newProduct.id, req.body.article);

      res.send({ data: newProduct });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole(ACCESS.DELETE_PRODUCTS),
  async (req, res) => {
    try {
      const product = await getProduct(req.params.id);

      await deleteProduct(req.params.id);

      await deleteProductLog(req.user.id, req.params.id, product.article);

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
    try {
      const oldProduct = await getProduct(req.params.id);

      const updatedProduct = await editProduct(req.params.id, {
        brand: req.body.brand,
        name: req.body.name,
        color: req.body.color,
        price: req.body.price,
        sizes: req.body.sizes,
      });

      // await deleteAllLogs();

      if (checkProductChanges(oldProduct, updatedProduct)) {
        await changeProductInfoLog(
          req.user.id,
          req.params.id,
          oldProduct,
          updatedProduct
        );
      }

      res.send({ data: updatedProduct });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
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
      const product = await getProduct(req.body.folder);

      await addPhotos({
        photos: req.files,
        folder: req.body.folder,
        typePhotos: req.body.typePhotos,
        currentSize: req.body.currentSize,
      });

      await addProductPhotosLog(
        req.user.id,
        req.body.folder,
        product.article,
        req.body.typePhotos,
        req.body.currentSize
      );

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
      const product = await getProduct(req.body.id);

      await deletePhoto({
        fileName: req.body.fileName,
        sizeName: req.body.sizeName,
        typeOfPhoto: req.body.typeOfPhoto,
        id: req.body.id,
      });

      if (req.body.sizeName) {
        await removeProductPhotosLog(
          req.user.id,
          req.body.id,
          product.article,
          req.body.typeOfPhoto,
          req.body.sizeName
        );
      } else {
        await removeProductPhotosLog(
          req.user.id,
          req.body.id,
          product.article,
          req.body.typeOfPhoto
        );
      }

      res.send({ data: "Photo was deleted" });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

module.exports = router;
