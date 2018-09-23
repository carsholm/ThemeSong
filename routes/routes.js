var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('themeSelect.json', 'utf8'));
var path = require('path');
var username;

var appRouter = function (app) {
  app.use(function (req,res,next){
    // check if client sent cookie
    var cookie = req.cookies.cookieName;
    if (cookie === undefined)
    {
      // no: set a new cookie
      app.get("/", function(req, res) {
        res.sendFile(path.join('C:/Users/Carson/ThemeSong' + '/index.html'));
      });
      app.post('/submit-username/', function (req, res, callback) {
        username = req.body.userID;
        console.log ('Username:' + username);
        res.cookie('cookieName', username, { maxAge: 900000, httpOnly: true });
        cookie = req.cookies.cookieName;
        console.log('Cookie Value:' + cookie);
        res.send(username + ' Submitted Successfully!');
      });

    } 
    else
    {
      // yes, cookie was already present 
      res.send('Welcome' + cookie + '!');
      console.log('cookie exists', cookie);
      if (cookie === "carson"){
        require('child_process').exec('cmd /c playSongScript.bat', function(){
          // …you callback code may run here…
        });
      }
    } 
    next(); // <-- important!   
  });
};
module.exports = appRouter;