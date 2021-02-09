#!/bin/sh

echo '{"clientId": "$CLIENT_ID","apiKey": "$API_KEY","scope": "https://www.googleapis.com/auth/calendar","discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]}' > ./apiGoogleconfig.json 
