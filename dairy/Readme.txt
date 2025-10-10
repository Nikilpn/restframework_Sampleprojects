# Dairy API Documentation

A Django REST Framework application for managing personal dairy/diary entries with user authentication and CRUD operations.

## Features

- User Registration and Authentication
- Token-based Authentication
- Create, Read, Update, Delete (CRUD) dairy entries
- Pagination support for diary listings
- User-specific diary entries
- Permission-based access control

## Tech Stack

- Django
- Django REST Framework
- Token Authentication
- Custom Pagination

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
**Endpoint:** `/api/register/` 
**Method:** `POST` 
**Permission:** AllowAny 
**Description:** Register a new user account

**Request Body:**
```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
```

**Response (201 Created):**
```json
{
  "user_id": 1,
  "username": "your_username",
  "token": "generated_token_here",
  "message": "User created successfully"
}
```

---

#### 2. User Login
**Endpoint:** `/api/login/` 
**Method:** `POST` 
**Permission:** AllowAny 
**Description:** Login with existing credentials

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "user_id": 1,
  "username": "your_username",
  "token": "your_auth_token",
  "message": "Login successful"
}
```

---

### Dairy Entry Endpoints

#### 3. Create Dairy Entry
**Endpoint:** `/api/dairy/create/` 
**Method:** `POST` 
**Permission:** IsAuthenticated 
**Description:** Create a new dairy entry for the authenticated user

**Headers:**
```
Authorization: Token your_auth_token
```

**Request Body:**
```json
{
  "Title": "My Dairy Entry Title",
  "Description": "This is the content of my dairy entry"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "Title": "My Dairy Entry Title",
  "Description": "This is the content of my dairy entry",
  "created_at": "2025-10-10T10:30:00Z"
}
```

---

#### 4. List Dairy Entries (Paginated)
**Endpoint:** `/api/dairy/list/` 
**Method:** `GET` 
**Permission:** IsAuthenticated 
**Description:** Get all dairy entries for the authenticated user with pagination

**Headers:**
```
Authorization: Token your_auth_token
```

**Query Parameters:**
- `page`: Page number (optional)
- `page_size`: Number of items per page (optional)

**Response (200 OK):**
```json
{
  "count": 10,
  "next": "http://api.example.com/api/dairy/list/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "Title": "My Dairy Entry",
      "Description": "Entry content",
      "created_at": "2025-10-10T10:30:00Z"
    }
  ]
}
```

---

#### 5. Update Dairy Entry
**Endpoint:** `/api/dairy/update/<pk>/` 
**Method:** `PUT` 
**Permission:** IsAuthenticated 
**Description:** Update an existing dairy entry (only your own entries)

**Headers:**
```
Authorization: Token your_auth_token
```

**Request Body (Partial update supported):**
```json
{
  "Title": "Updated Title",
  "Description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "message": "Dairy record updated successfully",
  "data": {
    "id": 1,
    "user": 1,
    "Title": "Updated Title",
    "Description": "Updated description",
    "updated_at": "2025-10-10T11:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Dairy record not found"
}
```

---

#### 6. Delete Dairy Entry
**Endpoint:** `/api/dairy/delete/<pk>/` 
**Method:** `DELETE` 
**Permission:** IsAuthenticated 
**Description:** Delete a dairy entry (only your own entries)

**Headers:**
```
Authorization: Token your_auth_token
```

**Response (200 OK):**
```json
{
  "message": "Dairy record deleted successfully"
}
```

**Error Responses:**

- **404 Not Found:**
```json
{
  "error": "Dairy record not found or access denied"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Deletion failed: error_message"
}
```

---

#### 7. List/Create Dairy (Admin Only)
**Endpoint:** `/api/dairy/` 
**Method:** `GET`, `POST` 
**Permission:** IsAdminUser 
**Description:** Admin view for listing and creating dairy entries

**Headers:**
```
Authorization: Token admin_auth_token
```

---

## Authentication

This API uses Token-based authentication. After registration or login, you'll receive a token that must be included in the header of subsequent requests:

```
Authorization: Token your_auth_token_here
```

## Permission Classes

- **AllowAny:** Public access (registration, login)
- **IsAuthenticated:** Requires valid authentication token
- **IsAdminUser:** Requires admin privileges

## Security Features

- Users can only create, view, update, and delete their own dairy entries
- Token-based authentication for secure API access
- Validation to prevent users from creating entries for other users
- Permission-based access control

## Pagination

The dairy list endpoint supports custom pagination. Configure pagination settings in `dairyapp/utils/pagination.py`.

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Nikilpn/restframeworksampleprojects.git
cd restapis
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install django djangorestframework
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser (optional):
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

**Create Dairy Entry:**
```bash
curl -X POST http://localhost:8000/api/dairy/create/ \
  -H "Authorization: Token your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"Title":"My First Entry","Description":"Today was a great day!"}'
```

### Using Postman

1. Set the request method and URL
2. Add `Authorization` header with value `Token your_token_here`
3. Set body to JSON format and add your data
4. Send the request

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid data or validation errors
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Models

### User Model
- Custom user model with token generation
- Fields: username, email, password, token

### Dairy Model
- Fields: user (ForeignKey), Title, Description, created_at, updated_at

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Note:** Replace `localhost:8000` with your actual domain when deploying to production.
