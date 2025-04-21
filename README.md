# Temporary Node.js Backend Application

A simple Node.js Express application with a health check route and a webhook endpoint for Read AI integration.

## Features

- Health check endpoint (`/health`)
- Read AI webhook endpoint (`/read-ai-webhook`)

## Installation

```bash
npm install
```

## Running the Application

### Standard Mode

```bash
npm start
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

## API Endpoints

### Health Check

```
GET /health
```

Returns a status message indicating the service is healthy.

### Read AI Webhook

```
POST /read-ai-webhook
```

Accepts webhook data from Read AI with the following structure:

```json
{
  "trigger": "string",
  "session_id": "string",
  "title": "string",
  "summary": "string",
  "report_url": "string",
  "action_items": [
    {
      "text": "string"
    }
  ],
  "transcript": {
    "speaker_blocks": [
      {
        "start_time": "number",
        "end_time": "number",
        "speaker": {
          "name": "string"
        },
        "words": "string"
      }
    ]
  }
}
```

## Port Configuration

The application runs on port 3000 by default. You can change this by setting the `PORT` environment variable.
