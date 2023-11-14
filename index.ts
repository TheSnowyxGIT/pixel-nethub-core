import * as ot from "opentype.js";

ot.load("VanillaRavioli_Demo.ttf", function (err, font) {
  if (err) {
    // error handling here
  } else {
    console.log(font?.names);
  }
});
