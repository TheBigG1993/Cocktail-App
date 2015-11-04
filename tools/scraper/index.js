var cluster = require('cluster');

if (cluster.isMaster) {
  var numWorkers = require('os').cpus().length;
  var fs = require("fs");

  var workers = [];

  for(var i = 0; i < numWorkers; i++) {
      cluster.fork();
  }

  for(wid in cluster.workers) {
      workers.push(wid);
  }

  cluster.on('online', function(worker) {
      worker.on('message', function (message) {
        handle_message(worker, message);
      });
  });

  function handle_message(worker, message) {
    if (counter >= 6217) {
      worker.send({type: "shutdown"});
    }

    if (message.type === "ready" || message.type === "error") {
      worker.send({type: "new", data: counter});
      counter++;
    } else if (message.type === "done") {
      console.log(`(${counter - numWorkers} of 6217) Adding ${message.data.title}`);
      drinks.push(message.data);
      worker.send({type: "new", data: counter});
      counter++;
    } else if (message.type === "exit") {
      workers.pop(worker.id);
      finish();
    }
  }

  function finish() {
    if (workers.length === 0) {
      saveJSON(drinks);
    }
  }

  // Store all of the drinks in an array
  var drinks = [];

  // To show a progress indicator
  var counter = 0;

// Cluster workers start here
} else {
  var fs = require("fs");
  var jsdom = require("jsdom");
  var jquery = fs.readFileSync('node_modules/jquery/dist/jquery.min.js').toString();

  // Root URL where the drinks are stored
  var root_url = "http://www.webtender.com/db/drink/";

  process.send({type:"ready"});

  process.on('message', function (message) {
    if (message.type === "shutdown") {
      process.send({type:"exit"});
      process.exit(0);
    }

    else if (message.type === "new") {
      process_request(message.data).then(function (data) {
        process.send({type: "done", data: data});
      })
      .catch(function (msg) {
        process.send({type: "error"});
      });
    }
  });
}

function process_request(id) {
  return new Promise(function(resolve, reject) {
    jsdom.env({
      url: root_url + id, // Download this URL for processing
      src: [jquery], // Import jQuery into this page
      encoding: 'binary',
      done: function (err, window) { // When finished downloading, do:

        // Increment counter — note that the for loop will be finished
        // before this code is ever reached (due to it being async), so a
        // separate counter must be used
        counter++;

        // If the HTTP response code isn't 200 (OK), then stop trying to
        // process this record and set this request to 'finished'.
        if (err) return reject();

        // Shortcut to reference jQuery
        var $ = window.$;

        // Strip the data out of the page by selecting the matching DOM elements
        var title = $("h1").text();

        // Extracting ingredients is a bit more complicated, so I put it inside
        // a self-invoking function to keep everything clean.
        var ingredients = (function () {

          // Find all of the <li> elements in the "Ingredients" section
          var list_items = $("h3:contains('Ingredients:')").next("ul").find("li");

          // Keep track of all the ingredients that are found
          var list = [];

          // For each <li>, strip the ingredient text out and add it to list[]
          $.each(list_items, function(index, ingredient) {

            // This website lists the amount outside of the <a> tag
            var amount = $(ingredient).contents().filter(function () {
              return this.nodeType == 3;
            }).text().trim();

            // The name is inside the <a> tag
            var name = $(ingredient).find("a").text().trim();

            // Push this individual ingredient into list[]
            list.push({
              amount: amount,
              name: name
            });
          });

          // Return the list
          return JSON.stringify(list);
        })();

        var instructions = $("h3:contains('Mixing instructions:')").next("p").text();

        window.close();

        var drink = {
          title: title,
          ingredients: ingredients,
          instructions: instructions
        };

        if (drink.title.length === 0 || drink.ingredients.length === 0 || drink.instructions.length === 0) reject();

        resolve(drink);
      }
    });
  });
}

function saveJSON (data) {
  var string = JSON.stringify(drinks, null, '\t');

  console.log("Writing data.json...");

  try {
    // Clear the data file before starting
    fs.truncateSync("data.json", 0);

    fs.writeFileSync("data.json", string, 'utf8');
  } catch (e) {
    console.log(e);
  }

  console.log("Done!");
}
