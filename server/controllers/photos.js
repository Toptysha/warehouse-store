const fs = require("fs").promises;
const path = require("path");
const PHOTOS_URLS = require("../constants/photos-url");
const PHOTOS_TYPE = require("../constants/photos-type");

function photosDirectory(
  folderNameId,
  folderNameCategory,
  folderNameMeasurementsSize
) {
  if (!folderNameId) {
    return path.join(
      __dirname,
      "..",
      `${PHOTOS_URLS.HOME_FOLDER}`,
      `${PHOTOS_URLS.PRODUCTS_FOLDER}`
    );
  } else if (!folderNameCategory) {
    return path.join(
      __dirname,
      "..",
      `${PHOTOS_URLS.HOME_FOLDER}`,
      `${PHOTOS_URLS.PRODUCTS_FOLDER}`,
      `${folderNameId}`
    );
  } else if (!folderNameMeasurementsSize) {
    return path.join(
      __dirname,
      "..",
      `${PHOTOS_URLS.HOME_FOLDER}`,
      `${PHOTOS_URLS.PRODUCTS_FOLDER}`,
      `${folderNameId}`,
      `${folderNameCategory}`
    );
  }

  return path.join(
    __dirname,
    "..",
    `${PHOTOS_URLS.HOME_FOLDER}`,
    `${PHOTOS_URLS.PRODUCTS_FOLDER}`,
    `${folderNameId}`,
    `${folderNameCategory}`,
    `${folderNameMeasurementsSize}`
  );
}

async function addPhotos({ photos, folder, typePhotos, currentSize }) {
  try {
    const uploadDir =
      typePhotos === PHOTOS_TYPE.TYPE_COVER
        ? photosDirectory(folder, PHOTOS_URLS.COVER_FOLDER)
        : photosDirectory(folder, PHOTOS_URLS.MEASUREMENTS_FOLDER, currentSize);

    if (!(await fs.access(uploadDir).catch(() => false))) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const existingFiles = await fs.readdir(uploadDir);
    const maxFiles = typePhotos === PHOTOS_TYPE.TYPE_COVER ? 6 : 10;
    const availableSlots = maxFiles - existingFiles.length;
    const filesToAdd = Math.min(photos.length, availableSlots);

    if (filesToAdd <= 0) {
      console.log("Лимит файлов достигнут, новые файлы не добавлены.");
      return;
    }

    await Promise.all(
      photos.slice(0, filesToAdd).map(async (photo) => {
        const photoPath = path.join(uploadDir, photo.originalname);
        await fs.writeFile(photoPath, photo.buffer);
      })
    );

    console.log("Фото успешно сохранены");
  } catch (error) {
    console.error("Ошибка при сохранении файлов:", error);
  }
}

async function getCovers(products) {
  const covers = await Promise.all(
    products.map(async (product) => {
      const directoryPath = photosDirectory(
        `${product.id}`,
        PHOTOS_URLS.COVER_FOLDER
      );
      const filePaths = [];

      try {
        const files = await fs.readdir(directoryPath);

        files.forEach((file) => {
          filePaths.push(
            `${process.env.PHOTOS_URL}/${product.id}/${PHOTOS_URLS.COVER_FOLDER}/${file}`
          );
        });
      } catch (err) {
        // console.error("Ошибка чтения папки:", err);
      }

      return { [product.id]: filePaths };
    })
  );

  return covers;
}

async function getCover(id) {
  const directoryPath = photosDirectory(`${id}`, PHOTOS_URLS.COVER_FOLDER);
  const filePaths = [];

  try {
    const files = await fs.readdir(directoryPath);

    files.forEach((file) => {
      filePaths.push(
        `${process.env.PHOTOS_URL}/${id}/${PHOTOS_URLS.COVER_FOLDER}/${file}`
      );
    });
    return filePaths;
  } catch (err) {
    // console.error("Ошибка чтения папки:", err);
  }
}

async function getMeasurements(id) {
  const directoryPath = photosDirectory(
    `${id}`,
    PHOTOS_URLS.MEASUREMENTS_FOLDER
  );

  const folderPaths = [];
  let folders = [];

  try {
    folders = await fs.readdir(directoryPath);

    folders.forEach((folder) => {
      folderPaths.push(
        `${photosDirectory(id, PHOTOS_URLS.MEASUREMENTS_FOLDER, folder)}`
      );
    });
  } catch (err) {
    // console.error("Ошибка чтения папки:", err);
  }

  let filesInFolder = folders.map((folder) => ({ [folder]: [] }));

  try {
    await Promise.all(
      folders.map(async (folder, index) => {
        const files = await fs.readdir(folderPaths[index]);
        const filePaths = files.map(
          (file) =>
            `${process.env.PHOTOS_URL}/${id}/${PHOTOS_URLS.MEASUREMENTS_FOLDER}/${folder}/${file}`
        );
        filesInFolder[index][folder] = filePaths;
      })
    );
  } catch (err) {
    // console.error("Ошибка чтения папки:", err);
  }

  return filesInFolder;
}

async function deletePhoto({ fileName, sizeName, typeOfPhoto, id }) {
  const filePath =
    typeOfPhoto === PHOTOS_TYPE.TYPE_COVER
      ? photosDirectory(id, PHOTOS_URLS.COVER_FOLDER) + `/${fileName}`
      : photosDirectory(id, PHOTOS_URLS.MEASUREMENTS_FOLDER, sizeName) +
        `/${fileName}`;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  photosDirectory,
  addPhotos,
  getCovers,
  getCover,
  getMeasurements,
  deletePhoto,
};
