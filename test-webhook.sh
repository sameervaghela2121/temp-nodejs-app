#!/bin/bash

curl -X POST \
  https://temp-nodejs-app.vercel.app/read-ai-webhook \
  -H 'Content-Type: application/json' \
  -d '{
  "session_id": "SESSIONID",
  "trigger": "meeting_end",
  "title": "Meeting Title",
  "summary": "Meeting summary goes here...",
  "action_items": [
    {
      "text": "Action item one"
    },
    {
      "text": "Action item two"
    }
  ],
  "report_url": "https://app.read.ai/analytics/meetings/SESSIONID",
  "transcript": {
    "speakers": [
      {
        "name": "Speaker 1"
      },
      {
        "name": "Speaker 2"
      }
    ],
    "speaker_blocks": [
      {
        "start_time": 0,
        "end_time": 10,
        "speaker": {
          "name": "Speaker 1"
        },
        "words": "Hello, this is the first speaker talking."
      },
      {
        "start_time": 11,
        "end_time": 20,
        "speaker": {
          "name": "Speaker 2"
        },
        "words": "And this is the second speaker responding."
      }
    ]
  }
}'
