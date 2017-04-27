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
            tb += "<td><div>" + contact.name + "</div></td>";
            tb += "<td><div>" + format(contact.phone_number) + "</div></td>";
            tb += "<td><div>" + contact.address + "</div></td>";
            tb += "<td class='edit' onclick='editRow(this)'><img src='https://cdn4.iconfinder.com/data/icons/miu/22/editor_pencil_pen_edit_write_-512.png' height='20' width='20' /></td>";
            tb += "<td class='delete' onclick='deleteRow(this)'><img src='http://megaicons.net/static/img/icons_sizes/8/178/512/editing-delete-icon.png'  height='20' width='20' /></td>";
            $("tbody").append(tb + "</tr>");
        }
        response.end($.html());
    }
    function format(pn) {
        return pn.substring(0, 3) + " " + pn.substring(3, 6) + " " + pn.substring(6, 9) + " " + pn.substring(9, 13);
    }
}).listen(port);

