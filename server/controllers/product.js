const { rimraf } = require("rimraf");
const { photosDirectory } = require("./photos");
const { prisma } = require("../prisma-service");

function addProduct(product) {
  return prisma.product.create({ data: product });
}

async function getProducts(search = "", limit = 10, page = 1) {
  const where = {
    OR: [
      { article: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { color: { contains: search, mode: "insensitive" } },
      { price: { contains: search, mode: "insensitive" } },
    ],
  };

  const [products, countProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      take: Number(limit),
      skip: limit * (page - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    lastPage: Math.ceil(countProducts / limit),
  };
}

function getProduct(id) {
  return prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });
}

function getProductByArticle(partOfArticle) {
  return prisma.product.findMany({
    where: {
      article: {
        contains: partOfArticle,
        mode: "insensitive",
      },
    },
  });
}

async function deleteProduct(id) {
  const folderPath = photosDirectory(id);

  rimraf.moveRemoveSync(folderPath);

  return prisma.product.delete({
    where: { id: Number(id) },
  });
}

async function editProduct(id, product) {
  // Проверка и рефакторинг цены, если она есть
  if (product.price) {
    let refactorPrice = "";
    if (
      isNaN(product.price) ||
      product.price.includes(".") ||
      product.price.includes(",")
    ) {
      const arrOfPrice = product.price.split("");
      arrOfPrice.forEach((element) => {
        if (!isNaN(element) && element !== " ") {
          refactorPrice += element;
        }
      });
      product.price = refactorPrice === "" ? product.price : refactorPrice;
    }
  }

  // Обновление продукта
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { ...product },
  });

  return updatedProduct;
}

async function getProductArticlesForOrders(orders) {
  const ordersWithProductArticles = await Promise.all(
    orders.map(async (order) => {
      const productsWithArticles = await Promise.all(
        order.product.map(async (products) => {
          const productWithArticles = await Promise.all(
            products.map(async (product) => {
              const productData = await prisma.product.findUnique({
                where: { id: Number(product.productId) },
                select: { article: true },
              });

              return {
                ...product,
                productArticle: productData?.article,
              };
            })
          );
          return productWithArticles;
        })
      );
      return { ...order, product: productsWithArticles };
    })
  );

  return ordersWithProductArticles;
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  getProductByArticle,
  deleteProduct,
  editProduct,
  getProductArticlesForOrders,
};
