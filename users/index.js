const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([
            { id: 1, name: 'User A' },
            { id: 2, name: 'User B' },
            { id: 3, name: 'User C' },
            { id: 4, name: 'User D' }
        ]));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3002, () => {
    console.log('Server is running on port 3002');
})