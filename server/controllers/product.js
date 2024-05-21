const { rimraf } = require("rimraf");
const Product = require("../models/Product");
const { photosDirectory } = require("./photos");

async function addProduct(product) {
  const newProduct = await Product.create(product);

  return newProduct;
}

async function getProducts(search = "", limit = 10, page = 1) {
  const [products, countProducts] = await Promise.all([
    Product.find({
      $or: [
        { article: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { price: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 }),
    Product.countDocuments(
      { article: { $regex: search, $options: "i" } } || {
          brand: { $regex: search, $options: "i" },
        } || { name: { $regex: search, $options: "i" } } || {
          color: { $regex: search, $options: "i" },
        } || { price: { $regex: search, $options: "i" } }
    ),
  ]);

  return {
    products,
    lastPage: Math.ceil(countProducts / limit),
  };
}

function getProduct(id) {
  return Product.findById(id);
}

async function deleteProduct(id) {
  const folderPath = photosDirectory(id);

  rimraf.moveRemoveSync(folderPath);

  return Product.deleteOne({ _id: id });
}

async function editProduct(id, product) {
  const updatedProduct = await Product.findByIdAndUpdate(id, product, {
    returnDocument: "after",
  });

  return updatedProduct;
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
};
