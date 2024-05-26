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
  let updatedProduct;

  if (product.price) {
    let refactorPrice = "";
    if (
      !Number(product.price) ||
      product.price.includes(".") ||
      product.price.includes(",")
    ) {
      arrOfPrice = product.price.split("");
      arrOfPrice.forEach((element) => {
        if (Number(element) || element === "0") {
          refactorPrice += element;
        }
      });
    }

    // console.log("TEST2", refactorPrice);
    updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...product,
        price: refactorPrice === "" ? product.price : refactorPrice,
      },
      {
        returnDocument: "after",
      }
    );
  } else {
    updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...product },
      {
        returnDocument: "after",
      }
    );
  }

  return updatedProduct;
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
};
