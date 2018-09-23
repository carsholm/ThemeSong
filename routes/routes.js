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
        res.cookie('cookieName', username, { maxAge: 90000000000000, httpOnly: true });
        cookie = req.cookies.cookieName;
        console.log('Cookie Value:' + cookie);
        res.send(username + ' Submitted Successfully!');
      });

    }  
    else {
      // yes, cookie was already present 
      res.send('Welcome' + cookie + '!');
      console.log('cookie exists', cookie);
      let script_string = path.join(__dirname + "/open_url.sh ");
      let user_timeout = 180000;
      if (cookie === "carson"){
        script_string += 'https://www.youtube.com/watch?v=RRKJiM9Njr8';
	user_timeout = 180000;
      } else if (cookie === "tj"){
        script_string += 'https://www.youtube.com/watch?v=J9FImc2LOr8';
	user_timeout = 180000;
      } else if (cookie === "sony"){
        script_string += 'https://youtu.be/vx2u5uUu3DE?t=25s';
	user_timeout = 180000;
      } else if (cookie === "lanna"){
        script_string += 'https://youtu.be/0t0fZeySNck?t=19s';
	user_timeout = 180000;
      } else {
        script_string += 'https://www.youtube.com/watch?v=_V2sBURgUBI';
	user_timeout = 180000;
      }
	console.log(script_string);
        const exec = require('child_process').exec;
        const playscript = exec(script_string);
          // …you callback code may run here…
	  playscript.stdout.on('data', function(data){
	    console.log(data);
	  });
	  playscript.stderr.on('data', function(data){
	    console.log(data);
          });
	setTimeout(() => {
		const killscript = exec(path.join(__dirname + "/kill_chrome.sh "));
	}, user_timeout);
   }  
    next(); // <-- important! 
  });
};
module.exports = appRouter;