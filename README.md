# study_doc  
`RESTful API`
## Overview

**Description:** 

**Technology stack:** `Node.js` `TypeScript` `Express` `MongoDB` `Mongoose` 

- localization: `i18next` `i18next-fs-backend` `i18next-http-middleware`
- security: `JWT` `hpp` `mongoSanitize` `express-rate-limit`
- testing: `jest` `supertest`

**Base URL:** `http://localhost:5050` - *to run locally*

---

## Authentication

Describe the authentication method used (e.g., API key, OAuth, JWT).

**Example:**

 

Multi language server 

 




 <img src="https://github.com/user-attachments/assets/407a1ae6-d65d-44f9-a2e8-10ceacf9235a" width="800">

---

## Endpoints

List and describe each endpoint, including the HTTP method, URL, parameters, request body, and response.

### 1. Get All Items

**Endpoint:** `/items`  
**Method:** `GET`  
**Description:** Retrieves a list of all items.

**Request:**

- **Headers:**  
  `Authorization: Bearer <token>`

- **Parameters:**  
  - `page` (optional, integer): Page number for pagination.
  - `limit` (optional, integer): Number of items per page.

**Response:**

- **Status Code:** `200 OK`
- **Body:**

```json
[
  {
    "id": 1,
    "name": "Item 1",
    "description": "Description of Item 1"
  },
  {
    "id": 2,
    "name": "Item 2",
    "description": "Description of Item 2"
  }
]

