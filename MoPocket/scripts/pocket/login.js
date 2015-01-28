

var api_key = "";

var    ht_protocol = "https://";
var    pocket_hostname = "getpocket.com";
var req_path = "/v3/oauth/request";
var auth_path = "/v3/oauth/authorize";
var    login_path = "/auth/authorize";
var auth_req_url = ht_protocol + pocket_hostname + req_path;
var user_auth_url = ht_protocol + pocket_hostname + auth_path;


function getPocketLoginURL()
{
    request_token=localStorage.getItem("code");
    redirect_uri = "/";
    return ht_protocol+pocket_hostname+login_path+"?"+"request_token="+request_token+"&redirect_uri="+redirect_uri;
}


var auth_req_url = ht_protocol+pocket_hostname+req_path;


function isLoggedIn()
{
    return ( localStorage.getItem("username") );
}

function pocket_authenticate(platform)
{
    if (isLoggedIn())
    {
        $("#data").html(strHel);
        $("#req_tok").html(localStorage.getItem("code"));
        $("#user").html(localStorage.getItem("username"));
        //return;
    }
    else
    {
        api_key = api_keys[platform];
        var request_data = { consumer_key: api_key, redirect_uri : "/" };
        var jqxhr = $.ajax({
                        type: 'POST',
                        dataType: "text",
                        contentType: 'application/x-www-form-urlencoded',
                        crossDomain:true,
                        url: auth_req_url,
                        data: request_data
                        }
                    )
                      .done(function( response ) {
                          var data = response.split('=');
                          localStorage.setItem(data[0], data[1]);
                          open_pocket_auth_form();
                      })
                      .fail(function (jqXHR, textStatus, errorThrown) {
                          $("#data").html( "error authenticating on: "+platform +" : " + jqXHR + " status: " + textStatus + " ; error: " +errorThrown   );
                      })
                      .always(function() {
                          $("#show").html(localStorage.getItem("code") );
                      });
    }
}

function open_pocket_auth_form()
{
    loginUrl = getPocketLoginURL();
    var ref = window.open(loginUrl, '_blank', "hidden=yes");
    ref.addEventListener('loadstop', function ( ev )
    {

        if (ev.url != getPocketLoginURL())
        {
            ref.close();
        }
        else
        {
            ref.show();
        }
    }
    );
    request_token = localStorage.getItem("code");
    request_data = { consumer_key: api_key, code: request_token };
    ref.addEventListener('exit', function () {
        $.ajax({
            type: 'POST',
            dataType: "text",
            contentType: 'application/x-www-form-urlencoded',
            crossDomain: true,
            url: user_auth_url,
            data: request_data
        })
        .done(function (response, textStatus) {
            alert(textStatus);
            var params = response.split('&');
            for (i = 0; i < params.length; i++) {
                var data = params[i].split('=');
                localStorage.setItem(data[0], data[1]);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $("#data").html("error getting user data. status: " + textStatus + " ; error: " + errorThrown);
        })
        .always(function () {
            $("#user").html(localStorage.getItem("username"));
        });
    });
}

function pocket_authenticate_desktop(platform)
{
    var api_key = api_keys[ platform ];
    var request_data = { consumer_key: api_key, redirect_uri : "/" };
    
    console.log(auth_req_url);
    
    var https = require('https');
    
    var dataString = JSON.stringify(request_data);

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
    
    

    var options = {
      hostname: pocket_hostname,
      port: 443,
      path: req_path,
      method: 'POST',
      headers: headers  
    };
    
/*    var options = {
        uri: auth_req_url,
        method: "POST",
        port: 443,
        form: { consumer_key: api_key, redirect_uri : "/" }
    };*/
    
    var req = https.request(options, function (res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function (d) {
            process.stdout.write(d);
        });
    });
    
    req.write(dataString);

    req.end();

    req.on('error', function (e) {
        console.error(e);
    });

/*
    var jqxhr = $.ajax({
                        type: 'POST',
                        dataType: "json",
                        contentType: 'text/plain',
                        crossDomain:true,
                        url: auth_req_url,
                          xhrFields: {
                                withCredentials: false
                          },
                        data: request_data
                        }
                    )
                      .done(function( data) {
                        console.log( data );
                      })
                      .fail(function() {
                        alert( "error authenticating on: "+platform );
                      })
                      .always(function() {
                        alert( "finished" );
    });    
    
    */
}