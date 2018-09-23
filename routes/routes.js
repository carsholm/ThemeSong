var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('themeSelect.json', 'utf8'));
var path = require('path');

var appRouter = function (app) {
    app.get("/", function(req, res) {
      res.sendFile(path.join('C:/Users/Carson/ThemeSong' + '/index.html'));
    });
    app.post('/submit-username/', function (req, res) {
      var username = req.body.userID;
      console.log (username);
      res.send(username + ' Submitted Successfully!');
      if (username === "carson"){
        require('child_process').exec('cmd /c playSongScript.bat', function(){
          // …you callback code may run here…
        });
      };
    })


 };
module.exports = appRouter;