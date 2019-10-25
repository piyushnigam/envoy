const express = require('express')
const auth = require('basic-auth')
const request = require('sync-request')
const bodyParser = require('body-parser');
const cookieParser = require('set-cookie-parser');
const app = express()
const port = 8080

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

function getExtAuth() {
  var respBody;
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      respBody = body;

      resolve(respBody);
    });
  });
}

//app.use((req, res, next) => {
app.get('/*', function(req, res) {
  console.log("+++++ req")
  console.log(req.headers.cookie)
  console.log("+++++ req")
  var options = {
    //url: 'http://piyushn-linuxworkstation.kir.corp.google.com:8788/v1/check',
    //method: 'POST',
    headers: {
      'User-Agent': 'request',
      'ClientId': '118126309516777767449',
      'ProjectNumber': '363174939109',
      'GAEAppId': 'iaap-test-dev',
      'ClientSecret': 'OKSb6HSjEAzg-y6oM46HkZ5Y'
    },
    body: `{
      "attributes": 
      { 
        "request": {
          "http": { 
            "method": "GET", 
            "scheme": "https", 
            "host": "${req.headers.host}",
            "path": "${req.url}",
            "headers":  {
              "ClientId": "118126309516777767449",
              "ClientSecret": "OKSb6HSjEAzg-y6oM46HkZ5Y",
              "ProjectNumber": "363174939109",
              "GAEAppId": "iaap-test-dev",
              "Cookie": "${req.headers.cookie}"
              }
          }
        }
      }
    }`
  };

  var resp = request('POST',
      'http://piyushn-linuxworkstation.kir.corp.google.com:8788/v1/check',
      options);
  var respBody = resp.getBody('utf-8');





    var jsonContent = JSON.parse(respBody);
    var cookieStr = ''
    if (jsonContent.hasOwnProperty('deniedResponse')) {
      var headers = jsonContent.deniedResponse.headers;
      for (var i=0; i<headers.length; i++) {
        if (headers[i].header.key == "http_response_code") {
          res.status(headers[i].header.value);
        } else {
          if (headers[i].header.key == "Set-Cookie") {
            var cookies = setCookie.parse(headers[i].header.value, {});
            console.log(cookies)
            for (var j=0; j<cookies.length;j++) {
              var cookie = cookies[j];
              console.log(cookie);
              console.log(cookie['name']);
              console.log(cookie['value']);
//            cookieStr.concat(cookie['name'], '=', cookie['value'],)
              res.cookie(`${cookie['name']}`, `${cookie['value']}`, {
                expires: new Date(Date.now() + 1000 * 60 * 24),
                httpOnly: true,
                path:'/',
                secure: true,
                sameSite:'none'
              });
            }
          } else {
          res.set(headers[i].header.key, headers[i].header.value);
          }
        }
      }
    } else {
      res.status(200);
      var headers = jsonContent.okResponse.headers;
      for (var i=0; i<headers.length; i++) {
        res.set(headers[i].header.key, headers[i].header.value);
      }
    }
//    res.cookie('piyushn', '1');
//    console.log("+++++ auth_server response")
//    console.log(jsonContent)
//    console.log("+++++ auth_server response")
    console.log("+++++ starting response output")
    console.log(res)
    console.log("+++++ end response output")
  res.send();
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
