var mysql = require("mysql");

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
    con.query("SELECT * FROM products", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});

//go over this section with the tutor. 
//  the following questions:
// -The first should ask them the ID of the product they would like to buy.
//-The second message should ask how many units of the product they would like to buy.
// var prompt = require('prompt');

// prompt.start();

// prompt.get('qty'), function (result, err){
//     console.log('qty: '+result.qty)
// }

var inquirer = require("inquirer");

// constructor function used to create programmers objects
function Programmer(product, qty) {
  this. product = product;
  this.qty = qty;
}

// creates the printInfo method and applies it to all programmer objects
Programmer.prototype.printInfo = function() {
  console.log("product: " + this.product + "\nqty: " + this.qty);
};


inquirer.prompt([
    {
      name: "product",
      message: "What product would you like to purchase?"
    }, 
    {
      name: "qty",
      message: "How much would you like to purchase?"
    }
  ]).then(function(answers) {
    // initializes the variable newProgrammer to be a programmer object which will take
    // in all of the user's answers to the questions above
    var newProgrammer = new Programmer(answers.product, answers.qty);
    // printInfo method is run to show that the newProgrammer object was successfully created and filled
    newProgrammer.printInfo();
  });
  