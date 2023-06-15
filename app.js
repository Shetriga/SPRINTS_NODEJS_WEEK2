const express = require("express");
const axios = require("axios");
const cc = require("currency-converter-lt");

const app = express();

axios
  .get("https://api.escuelajs.co/api/v1/products")
  .then((response) => {
    const tmp = Object.entries(response.data);
    // console.log(tmp[1][1]);

    // Trying to get unique category ids from our response
    let tmpAfterSorting = tmp.map((t) => {
      return t[1];
    });
    let extractedCategory = tmpAfterSorting.map((t) => {
      return t.category;
    });
    // console.log(extractedCategory);
    let extractedIds = extractedCategory.map((c) => {
      return c.id;
    });
    let finalArr = extractedIds.filter(
      (item, index) => extractedIds.indexOf(item) === index
    );
    // console.log(finalArr);

    // The following lines are the final output for the new array
    let result = [];
    for (let i = 0; i < finalArr.length; i++) {
      for (let j = 0; j < tmp.length; j++) {
        if (tmp[j][1].category.id === finalArr[i]) {
          // console.log("We got it!");
          result.push({
            category: {
              id: tmp[j][1].category.id,
              name: tmp[j][1].category.name,
            },
            products: [],
          });
          break;
        }
      }
    }

    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < tmp.length; j++) {
        if (tmp[j][1].category.id === result[i].category.id) {
          // console.log("We got it!");
          result[i].products.push(tmp[j][1]);
        }
      }
    }
    console.log(result);

    // The following lines are to convert the currency
    result.forEach((r) => {
      r.products.forEach((p) => {
        let currencyConverter = new cc();
        currencyConverter
          .from("USD")
          .to("EGP")
          .amount(p.price)
          .convert()
          .then((res) => console.log(res));
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(`Server is up and running!`);
});
