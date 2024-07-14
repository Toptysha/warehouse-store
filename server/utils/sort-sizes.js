function sortSizes(sizes) {
  const sortedArray = sizes.sort((a, b) => {
    const extractNumber = (str) => parseInt(str.replace(/-(min|max)$/, ""), 10);

    const numA = extractNumber(a);
    const numB = extractNumber(b);

    if (numA !== numB) {
      return numA - numB;
    }

    if (a.includes("-min") && b.includes("-max")) {
      return -1;
    }
    if (a.includes("-max") && b.includes("-min")) {
      return 1;
    }

    return 0;
  });

  return sortedArray;
}

module.exports = {
  sortSizes,
};
