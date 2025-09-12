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

## Configuration

There are two configuration files in this system which you have to configure:
<br>

- config.env <br>
  This is the file where all your secrets live; for e.g. server ports, encryption keys etc.
  <br>
- Dockerfile<br>
  This is the Dockerfile example which you can use to create a non-exiting container

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

### PATCH /api/container/restartContainer

### Description:

Restarts a container on worker node, but ensuring that the request is coming from management server using HMAC signature

### Request Body:

```json
{
  
}
```
