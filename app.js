const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(bodyParser.json());

// Serve static files from the data directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Route to list all available JSON files
app.get('/data-files', (req, res) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        filename: file,
        url: `/data/${file}`,
        created: fs.statSync(path.join(dataDir, file)).mtime
      }))
      .sort((a, b) => b.created - a.created); // Sort by creation time, newest first
    
    res.status(200).json({ files });
  } catch (error) {
    console.error('Error listing data files:', error);
    res.status(500).json({ message: 'Error listing data files', error: error.message });
  }
});

// Read AI webhook route
app.post('/read-ai-webhook', (req, res) => {
  const data = req.body;

  console.log("recieved data", JSON.stringify(data));

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

  // Write data to JSON file
  try {
    // Create a filename using session_id and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${session_id || 'unknown'}_${timestamp}.json`;
    const filePath = path.join(__dirname, 'data', filename);
    
    // Write the data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data written to file: ${filePath}`);
    
    // Generate the URL for accessing the file
    const fileUrl = `${req.protocol}://${req.get('host')}/data/${filename}`;
    
    return res.status(200).json({ 
      message: "Webhook received and data saved", 
      file: filename,
      url: fileUrl
    });
  } catch (error) {
    console.error('Error writing data to file:', error);
    return res.status(500).json({ message: "Error saving webhook data", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`Webhook endpoint available at: http://localhost:${PORT}/read-ai-webhook`);
  console.log(`JSON files accessible at: http://localhost:${PORT}/data/[filename]`);
  console.log(`List of all JSON files: http://localhost:${PORT}/data-files`);
});
