const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Read AI webhook route
app.post('/read-ai-webhook', (req, res) => {
  const data = req.body;

  const trigger = data.trigger;
  const session_id = data.session_id;
  const title = data.title;
  const summary = data.summary;
  const report_url = data.report_url;
  const action_items = data.action_items || [];
  const transcript = data.transcript || {};

  console.log(`Trigger: ${trigger}`);
  console.log(`Session ID: ${session_id}`);
  console.log(`Title: ${title}`);
  console.log(`Summary: ${summary}`);
  console.log(`Report URL: ${report_url}`);

  console.log("Action Items:");
  action_items.forEach(item => {
    console.log(`- ${item.text}`);
  });

  console.log("Transcript:");
  if (transcript.speaker_blocks) {
    transcript.speaker_blocks.forEach(block => {
      console.log(`[${block.start_time} - ${block.end_time}] ${block.speaker.name}: ${block.words}`);
    });
  }

  return res.status(200).json({ message: "Webhook received" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`Webhook endpoint available at: http://localhost:${PORT}/read-ai-webhook`);
});
