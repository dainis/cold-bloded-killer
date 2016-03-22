"use strict";

let http = require('http'),
  server = http.createServer();

server.timeout = 2500 * 1000;

server.on('request', (req, resp) => {
  console.log(new Date(), req.url);

  if(req.url === '/slow') {
    return slowResponse(resp);
  }

  if(req.url === '/loop') {
    return loopResponse(resp);
  }

  if(req.url === '/binary') {
    return binaryResponse(resp);
  }

  if(req.url === '/multi') {
    return multiResponse(resp);
  }

  if(req.url === '/single') {
    return singleTitle(resp);
  }

  if(req.url === '/quotes') {
    return quotesResponse(resp);
  }

  resp.end('#yolo');
});

function slowResponse(resp) {
  resp.writeHead(200);

  let cnt = 0,
    interval = setInterval(() => {
      resp.write(':O');
      cnt += 1;

      if(cnt > 1000) {
        resp.end();
        clearInterval(interval);
      }
    }, 2500);
}

function loopResponse(resp) {
  resp.setHeader('Location', '/loop');
  resp.writeHead(302);
  resp.end('#yolo');
}

let b = [];

for(let i = 0; i < 128; i++) {
  b.push(128+i);
}

let buff = new Buffer(b);

function binaryResponse(resp) {
  let cnt = 0;
  function l() {
    cnt += 1;
    if(cnt > 1000) {
      return resp.end(new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0]));
    }

    resp.write(buff);
    process.nextTick(l);
  }

  l();
}

function multiResponse(resp) {
  resp.writeHead(200);
  resp.write('<!DOCTYPE html>\n');
  resp.write('<html>\n');
  resp.write('<head>\n');
  for(var i = 0; i < 10; i++) {
    resp.write('<title>' + (new Array(512).join('\t\t\t\t\t\t\t\t\t\n\n\n\n\n\n\n\n\n\n#yolo\t\t\t\t\t\t\t\t\t\n\n\n\n\n\n\n\n\n\n')) + '</title>\n');
  }
  resp.write('</head>');
  resp.write('</html>');
  resp.end();
}

function singleTitle(resp) {
  resp.writeHead(200);
  resp.write('<!DOCTYPE html>\n');
  resp.write('<html>\n');
  resp.write('<head>\n');
  resp.write('<title>' + (new Array(512).join('\t\t\t\t\t\t\t\t\t\n\n\n\n\n\n\n\n\n\n#yolo\t\t\t\t\t\t\t\t\t\n\n\n\n\n\n\n\n\n\n')) + '</title>\n');
  resp.write('</head>\n');
  resp.write('</html>\n');
  resp.end();
}

function quotesResponse(resp) {
  resp.writeHead(200);
  resp.write('<!DOCTYPE html>\n');
  resp.write('<html>\n');
  resp.write('<head>\n');
  resp.write('<title>' + (new Array(512).join('"')) + '</title>\n');
  resp.write('</head>\n');
  resp.write('</html>\n');
  resp.end();
}

server.listen(process.env.PORT || 80);