var http = require('http');
var port = process.env.port || 1337;
var x = '';
var fs = require("fs");
var cheerio = require("cheerio");

http.createServer(function (request, response) {
    var $;
    fs.readFile("tableFile.html", function (err, data) {
        if (err) throw err;
        $ = cheerio.load(data);
    });
    http.get('http://www.mocky.io/v2/581335f71000004204abaf83', function (res) {
        res.on('data', function (data) {
            x = data.toString(); // for some reason 'data' pinged twice
        });
        res.on('error', function (error) {
            console.log(error.toString());
        });
        res.on('end', next);
    });
    function next() {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        
        var obj = JSON.parse(x);
        for (var i = 0; i < obj.contacts.length; i++) {
            var contact = obj.contacts[i];
            var tb = "<tr>";
            tb += "<td>" + contact.name + "</td>";
            tb += "<td>" + format(contact.phone_number) + "</td>";
            tb += "<td>" + contact.address + "</td>";
            $("tbody").append(tb + "</tr>");
        }
        response.end($.html());
    }
    function format(pn) {
        return pn.substring(0, 3) + " " + pn.substring(3, 6) + " " + pn.substring(6, 9) + " " + pn.substring(9, 13);
    }
}).listen(port);

