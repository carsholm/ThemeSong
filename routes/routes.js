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
        res.sendFile(path.join(__dirname + '/index.html'));
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
        const exec = require('child_process').exec;
        const playscript = exec('mpg123 /home/pi/Desktop/ThemeSong/routes/seinfeld.mp3');
          // …you callback code may run here…
	  playscript.stdout.on('data', function(data){
	    console.log(data);
	  });
	  playscript.stderr.on('data', function(data){
	    console.log(data);
          });
      }
    } 
    next(); // <-- important!   
  });
};
module.exports = appRouter;