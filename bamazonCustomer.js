var mysql = require("mysql");
// const cTable = require("console.table");
const cTable = require('console.table');
var inquirer = require("inquirer");




var con = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// pulls data from table and displays it node
con.connect(function (err) {
  if (err) throw err;
  //Select all products and return the result object:
  displayProducts();
});

function displayProducts() {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    console.table(result);

    let productArray = [];
    for (let i = 0; i < result.length; i++) {
      productArray.push(result[i].Product_name);
    }

    proptCustomer(productArray);
  });

}

//go over this section with the tutor. 
//  the following questions:
// -The first should ask them the ID of the product they would like to buy.
//-The second message should ask how many units of the product they would like to buy.
// var prompt = require('prompt');

// prompt.start();

// prompt.get('qty'), function (result, err){
//     console.log('qty: '+result.qty)
// }







function proptCustomer(products) {
  

  inquirer.prompt([
    {
      name: "product",
      message: "What product would you like to purchase?",
      type: "list",
      choices: products
    },
    {
      name: "qty",
      message: "How much would you like to purchase?",
      type: "input"
    }
  ]).then(function (answers) {

    // console.log(answers);
    // initializes the variable newProgrammer to be a programmer object which will take
    // in all of the user's answers to the questions above

    if (Number.isInteger(parseInt(answers.qty))) {

      
      // constructor function used to create programmers objects
      function Customer(product, qty) {
        this.product = product;
        this.qty = qty;
        this.itemPurchased = [];
        
        
      }

      // creates the printInfo method and applies it to all programmer objects
      Customer.prototype.printInfo = function () {
        console.log("product: " + this.product + "\nqty: " + this.qty);
      };

      var customer = new Customer(answers.product, answers.qty);
      checkInventory(customer);
    } else {
      console.log("Please enter a valid integer for product quanity");
      continueShoppingPrompt();
    }

    // printInfo method is run to show that the newProgrammer object was successfully created and filled
    // newProgrammer.printInfo();

    // console.log(newProgrammer);


  });

}

function checkInventory(CustomerObject) {
  con.query("SELECT Product_name, price, Stock_quantity FROM products where Product_name=?",
    [CustomerObject.product], function (err, results, fields) {

      if (err) throw err;

      // console.log(results);

      let inventory = results[0].Stock_quantity;
      // console.log("inventory: " + inventory);

      let price = results[0].price;
      // console.log("Price: " + price);

      let totalSalesPrice = CustomerObject.qty * price;
      // console.log("totalSalesPrice: " + totalSalesPrice);

      let remainingInventory = inventory - CustomerObject.qty;
      // console.log("remainingInvetory: " + remainingInventory);

      let productName = CustomerObject.product;

      if (remainingInventory > 0) {
        console.log("Congrats, you just purchased " + CustomerObject.qty + " " + CustomerObject.product + " for $" + totalSalesPrice);
        CustomerObject.itemPurchased.push(productName);
        updateInventoy(productName, remainingInventory)

      } else {
        console.log("Sorry, insufficient quantity");
        continueShoppingPrompt();
      }

    })
}

function updateInventoy(product, newInventory) {
  con.query("UPDATE products SET ? WHERE ?", [
    {
      Stock_quantity: newInventory
    },
    {
      Product_name: product
    }
  ], function (err, results, fields) {
    if (err) throw err;

    // console.log(results);

    if (results.affectedRows > 0) {
      continueShoppingPrompt();
    } else {
      console.log("Something went wrong! Database wasn't updated. Cancel the sale immediately!");
      continueShoppingPrompt();
    }
  })
}

function continueShoppingPrompt() {
  inquirer.prompt([{
    name: "continue",
    type: "confirm",
    message: "Would you like to continue shopping?"
  }]).then(answers => {
    if (answers.continue) {
      displayProducts();
    } else {
      console.log("Thank you for shopping! Please come back soon.");
      con.end();
    }
  })
}
