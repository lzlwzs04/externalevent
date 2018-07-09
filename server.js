var express = require('express');
var app = express();
var port = 8080;

app.use(express.bodyParser());

function authenticate(username, password, req, res) {
	var auth = req.get('Authorization');
	if (!auth) {
		res.status(401).send('Authorization is missing');
    }
    if (auth.startsWith('Basic')){
       	auth = auth.substring(6);
	    var authString = new Buffer(auth, 'base64').toString('ascii');
	    var inputUser = authString.trim().split(":")[0];
	    var inputPass = authString.trim().split(":")[1];
	
	    if(inputUser !== username || inputPass !== password) {
		    res.status(401).send('Authorization Failed ' + inputUser + ':' + inputPass);
	    } 
    }
}

app.post('/v2',
				function(req, res) {
					authenticate('admin', 'pwd', req, res);
					if (res.finished) {
						return;
					}
					var responseBody = "<S:Envelope xmlns:S=\"http://schemas.xmlsoap.org/soap/envelope/\">";
					responseBody+="<S:Header><S:startup tenantid=\"0246bff8-40d5-4247-a439-0afa1cf07ad4\"></S:startup></S:Header>"
					responseBody += "<S:Body>";
					responseBody += "<ns2:ExternalEventResponse xmlns:ns2=\"http://notification.event.successfactors.com\">";
					responseBody += "<ns2:responsePayload>";
					responseBody += "<ns2:status>200</ns2:status>";
					responseBody += "<ns2:statusDate>" + new Date().toISOString() + "</ns2:statusDate>";
					responseBody += "<ns2:statusDetails><![CDATA[" + req.body + "]]></ns2:statusDetails>";
					responseBody += "</ns2:responsePayload>";
					responseBody += "</ns2:ExternalEventResponse>";
					responseBody += "</S:Body>";
					responseBody += "</S:Envelope>";
					res.setHeader('Content-Type', 'text/xml; charset=utf-8');
					res.send(responseBody);
				});

app.post('/v1',
				function(req, res) {
					authenticate('admin', 'pwd', req, res);
					if (res.finished) {
						return;
					}
					var responseBody = "<S:Envelope xmlns:S=\"http://schemas.xmlsoap.org/soap/envelope/\">";
					responseBody += "<S:Body>";
					responseBody += "<ns2:ExternalEventResponse xmlns:ns2=\"com.successfactors.event.notification\">";
					responseBody += "<ns2:responsePayload>";
					responseBody += "<ns2:status>200</ns2:status>";
					responseBody += "<ns2:statusDate>" + new Date().toISOString() + "</ns2:statusDate>";
					responseBody += "<ns2:statusDetails><![CDATA[" + req.body + "]]></ns2:statusDetails>";
					responseBody += "</ns2:responsePayload>";
					responseBody += "</ns2:ExternalEventResponse>";
					responseBody += "</S:Body>";
					responseBody += "</S:Envelope>";
					res.setHeader('Content-Type', 'text/xml; charset=utf-8');
					res.send(responseBody);
				});
				
app.post('/v3',
				function(req, res) {
					authenticate('admin', 'pwd', req, res);
					if (res.finished) {
						return;
					}
					var responseBody = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Header></soap:Header><soap:Body><ns1:ExternalEventResponse xmlns:ns1=\"com.successfactors.event.notification\">";
					responseBody += "<ns1:responsePayload>";
					responseBody += "<ns1:entityId>JobRequistion</ns1:entityId>";
					responseBody += "<ns1:status>0</ns1:status>";
					responseBody += "<ns1:statusDate>2017-01-01T00:00:00-01:00</ns1:statusDate>";
					responseBody += "<ns1:statusDetails>Success</ns1:statusDetails>";
					responseBody += "</ns1:responsePayload>";
					responseBody += "</ns1:ExternalEventResponse></soap:Body></soap:Envelope>";
					res.setHeader('Content-Type', 'text/xml; charset=utf-8');
					res.send(responseBody);
				});

app.listen(port, function(error) {
	if (error) {
		console.error(error);
	}
	console.log('Server started! At http://localhost:' + port);
});
