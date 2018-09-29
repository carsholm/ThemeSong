var fs = require('fs');
var path = require('path');
var username;
var new_youtube_url;
var new_length;

var appRouter = function (app) {
  app.use(function (req,res,next){
    // check if client sent cookie
    var cookie = req.cookies.cookieName;
    if (cookie === undefined)
    {
      // no: set a new cookie
      app.get("/", function(req, res) {
        // Registration Page
        res.sendFile(path.join(__dirname + '/index.html'));
      });

      app.post('/submit-username/', function (req, res, callback) {
        // Success Page
        username = req.body.userID;
        AddNewJsonObject(req.body);
        console.log ('Username:' + username);
        res.cookie('cookieName', username, { maxAge: 90000000000000, httpOnly: true });
        cookie = req.cookies.cookieName;
        console.log('Cookie Value:' + cookie);
        res.send(username + ' Submitted Successfully!');
      });

    }  
    else {
      // yes, cookie was already present 
      res.send('Welcome ' + cookie + '!');
      console.log('cookie exists', cookie);
      var script_string = path.join(__dirname + "/open_url.sh ");
      var user_timeout = 180000;
      var match_found = false;
      var obj = JSON.parse(fs.readFileSync('themeSelect.json', 'utf8'));
      for(var i = 0; i < obj.length; i++){
        if (cookie == obj[i].userid){
          console.log("user match!");
          script_string +=  obj[i].youtube_url;
          user_timeout = obj[i].length_to_play;
          match_found = true;
        }
      }
      if (!match_found){
        console.log("Using default theme.");
        script_string += obj[obj.length - 1].youtube_url;
        user_timeout = obj[obj.length - 1].length_to_play;
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
      }, user_timeout * 1000); 
   }  
    next(); // <-- important! 
  });
};

function AddNewJsonObject(new_obj){
  // Read json file
  var obj = JSON.parse(fs.readFileSync('themeSelect.json', 'utf8'));
  new_youtube_url = new_obj.youtube_url;
  new_length = new_obj.length_to_play;

  var match_found = false;
  for(var i = 0; i < obj.length; i++){
    if (username == obj[i].userid){
      match_found = true;
    }
  }
  if (!match_found){
    var new_obj = {
      userid: username,
      youtube_url: new_youtube_url,
      length_to_play: new_length
    };
    obj.push(new_obj);
    var data = JSON.stringify(obj, null, 2);
    fs.writeFile('themeSelect.json', data, function(err){  
      if (err) {console.log(err); throw err;}
      console.log('Data written to file');
    });
  }
}
module.exports = appRouter;