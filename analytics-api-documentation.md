# Analytics API Documentation

## Base URL

```bash
http://localhost:5000/api/v1/analytics
```

---

# 1. Get Click Analytics by Page URL

## Endpoint

```bash
GET /click?pageUrl=<encoded_page_url>
```

## Example Request

```bash
curl --location 'http://localhost:5000/api/v1/analytics/click?pageUrl=file%3A%2F%2F%2FC%3A%2FUsers%2Fsudip%2FDownloads%2FCausalFunnel%2Ftracking-script%2Findex.html'
```

---

## Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `pageUrl` | string | Yes      | Encoded page URL |

---

## Example Response

```json
{
  "pageUrl": "file:///C:/Users/sudip/Downloads/CausalFunnel/tracking-script/index.html",
  "hitCount": [
    {
      "id": "6a02bb6f4ed7a74b687c38ee",
      "sessionId": "e1645107-11b8-4288-9163-a2d7a8b36309",
      "eventType": "click",
      "pageUrl": "file:///C:/Users/sudip/Downloads/CausalFunnel/tracking-script/index.html",
      "timestamp": "2026-05-12T05:32:31.734Z",
      "clickX": 419,
      "clickY": 276,
      "createdAt": "2026-05-12T05:32:31.741Z"
    }
  ]
}
```

---

# 2. Get All Sessions

## Endpoint

```bash
GET /sessions
```

## Example Request

```bash
curl --location 'http://localhost:5000/api/v1/analytics/sessions'
```

## Example Response

```json
[
  {
    "_id": "e1645107-11b8-4288-9163-a2d7a8b36309",
    "totalEvents": 16,
    "lastActivity": "2026-05-12T06:04:30.234Z"
  }
]
```

---

# 3. Get Session Details

## Endpoint

```bash
GET /session/:sessionId
```

## Example Request

```bash
curl --location 'http://localhost:5000/api/v1/analytics/session/e1645107-11b8-4288-9163-a2d7a8b36309'
```

---

## Path Parameters

| Parameter   | Type   | Required | Description     |
| ----------- | ------ | -------- | --------------- |
| `sessionId` | string | Yes      | User session ID |

---

# Event Types

| Event Type  | Description                            |
| ----------- | -------------------------------------- |
| `page_view` | Triggered when a page is opened        |
| `click`     | Triggered when user clicks on the page |

---
