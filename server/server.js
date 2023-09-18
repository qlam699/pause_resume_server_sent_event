const express = require('express');
const { EventEmitter } = require('events');

const app = express();
const emitter = new EventEmitter();
const AUTO_CLOSE_TIME = 3000
const PORT = 5000

app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  // Function to send events
  const sendEvent = (eventName, data) => {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    setTimeout(() => {
      emitter.removeListener('custom-event', handleSendEvent)
      res.end()
    }, AUTO_CLOSE_TIME)
  };

  // Register event listener
  const handleSendEvent = (data) => {
    sendEvent('custom-event', data);
  }
  emitter.on('custom-event', handleSendEvent);

  // Handle client disconnect
  req.on('close', () => {
    emitter.off('custom-event', sendEvent);
  });
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:5000');
});

// Simulate events being sent
setInterval(() => {
  emitter.emit('custom-event', { message: 'This is an SSE message' });
}, 1000);

