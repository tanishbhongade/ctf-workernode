# Worker Node Server

## Description

A worker node server that is part of a distributed CTF infrastructure.  
Each worker node handles:

- Container creation for new players
- Container removal when players advance to next levels

All routes are protected using HMAC-based authentication to ensure requests come from the management server.

---

## Running the Server

```bash
npm i
node server.js
```

## API endpoints

### POST /api/container/createContainer

### Description:

Creates a container on worker node, but ensuring that the request is coming from management server using HMAC signature

### Request Body:

```json
{
  "imageName": "your-image"
}
```

### DELETE /api/container/deleteContainer

### Description:

Deletes a container on worker node, but ensuring that the request is coming from management server using HMAC signature

### Request Body:

```json
{
  "containerId": "playercontainerId"
}
```
