# FCM Push Notification API Documentation

A Django REST Framework application for managing Firebase Cloud Messaging (FCM) push notifications with user authentication and device token management.

## Features

- User Registration and Authentication
- Token-based Authentication
- FCM Device Token Registration
- Send push notifications to individual users
- Send push notifications to authenticated user's own device
- Broadcast notifications to all registered users (Admin only)
- Manual FCM token notification sending
- Comprehensive notification tracking and reporting

## Tech Stack

- Django
- Django REST Framework
- Firebase Cloud Messaging (FCM)
- Firebase Admin SDK
- Token Authentication
- drf-yasg (Swagger Documentation)

## Prerequisites

Before running this application, you need:

1. **Firebase Project Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a service account key (JSON file)
   - Download the `serviceAccountKey.json` file

2. **Python Packages:**
   ```bash
   pip install django
   pip install djangorestframework
   pip install firebase-admin
   pip install drf-yasg
   ```

## Firebase Configuration

1. Place your `serviceAccountKey.json` in your project root or a secure location
2. Initialize Firebase in your Django settings or startup:

```python
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
**Endpoint:** `/api/register/` 
**Method:** `POST` 
**Permission:** AllowAny 
**Description:** Register a new user account (Step 1)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "username"
}
```

**Response (200 OK):**
```json
{
  "user_id": 1,
  "user_email": "user@example.com"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": {
    "email": ["This field is required."],
    "password": ["This field is required."]
  }
}
```

---

#### 2. User Login
**Endpoint:** `/api/login/` 
**Method:** `POST` 
**Permission:** AllowAny 
**Description:** Login with existing credentials (Step 2)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "user_id": 1,
  "username": "user@example.com",
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "message": "Login successful"
}
```

---

### FCM Token Management

#### 3. Register FCM Token
**Endpoint:** `/api/fcm/register/` 
**Method:** `POST` 
**Permission:** IsAuthenticated 
**Description:** Register device FCM token for push notifications (Step 3)

**Headers:**
```
Authorization: Token your_auth_token
```

**Request Body:**
```json
{
  "device_token": "your_fcm_device_token_from_firebase"
}
```

**Response (201 Created):**
```json
{
  "message": "FCM token saved successfully"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "User already has FCM token. Cannot add another token."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "FCM token cannot be saved",
  "details": {
    "device_token": ["This field is required."]
  }
}
```

---

#### 4. List All FCM Tokens
**Endpoint:** `/api/fcm/list/` 
**Method:** `GET` 
**Permission:** AllowAny 
**Description:** Get list of all registered FCM tokens

**Headers:**
```
Authorization: Token your_auth_token
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_email": "user1@example.com",
    "device_token": "fcm_token_string",
    "created_at": "2025-10-10T10:30:00Z"
  },
  {
    "id": 2,
    "user_email": "user2@example.com",
    "device_token": "fcm_token_string_2",
    "created_at": "2025-10-10T11:00:00Z"
  }
]
```

---

### Push Notification Endpoints

#### 5. Send Notification to Self
**Endpoint:** `/api/notification/send-to-self/` 
**Method:** `POST` 
**Permission:** IsAuthenticated 
**Description:** Send push notification to your own registered device

**Headers:**
```
Authorization: Token your_auth_token
```

**Request Body:**
```json
{
  "title": "Hello!",
  "message": "This is a test notification to myself"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification sent to your device",
  "user": "username",
  "message_id": "projects/your-project/messages/0:1234567890"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No FCM token found for your account. Please register your device first."
}
```

---

#### 6. Send Notification Manually (by FCM Token)
**Endpoint:** `/api/notification/send/` 
**Method:** `POST` 
**Permission:** AllowAny 
**Description:** Send notification by manually providing FCM token

**Request Body:**
```json
{
  "fcm_token": "recipient_fcm_device_token",
  "title": "Manual Notification",
  "message": "This is sent using manual FCM token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "message_id": "projects/your-project/messages/0:1234567890"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to send notification: Invalid registration token"
}
```

---

#### 7. Broadcast Notification to All Users (Admin Only)
**Endpoint:** `/api/notification/broadcast/` 
**Method:** `POST` 
**Permission:** IsAdminUser 
**Description:** Send push notification to all registered users using for loop

**Headers:**
```
Authorization: Token admin_auth_token
```

**Request Body:**
```json
{
  "title": "Important Announcement",
  "message": "This is a broadcast message to all users"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Broadcast notification completed",
  "summary": {
    "total_users": 10,
    "success_count": 9,
    "failure_count": 1,
    "success_rate": "90.0%"
  },
  "admin_info": {
    "admin_email": "admin@example.com",
    "admin_id": 1,
    "is_staff": true,
    "sent_at": "2025-10-10T12:00:00.123456+00:00"
  },
  "notification_details": {
    "title": "Important Announcement",
    "message": "This is a broadcast message to all users"
  },
  "detailed_results": [
    {
      "user_email": "user1@example.com",
      "user_id": 2,
      "success": true,
      "message_id": "projects/your-project/messages/0:1234567890",
      "token_preview": "fcm_token_preview..."
    },
    {
      "user_email": "user2@example.com",
      "user_id": 3,
      "success": false,
      "error": "Invalid registration token",
      "token_preview": "fcm_token_preview..."
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No device tokens found in database"
}
```

---

## Authentication

This API uses Token-based authentication. Include your token in request headers:

```
Authorization: Token your_auth_token_here
```

## Permission Classes

- **AllowAny:** Public access (registration, login)
- **IsAuthenticated:** Requires valid authentication token
- **IsAdminUser:** Requires admin privileges (for broadcast notifications)

## Getting Started

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Nikilpn/restframeworksampleprojects.git
cd fcmapp
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure Firebase:**
   - Download your Firebase service account key
   - Place it in a secure location
   - Update the path in your settings/initialization code

5. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser (for admin features):**
```bash
python manage.py createsuperuser
```

7. **Run development server:**
```bash
python manage.py runserver
```

---

## Complete Workflow Example

### Step 1: Register User
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "username": "testuser"
  }'
```

### Step 2: Login
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Response will include your token:
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Step 3: Register FCM Token
```bash
curl -X POST http://localhost:8000/api/fcm/register/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json" \
  -d '{
    "device_token": "your_actual_fcm_token_from_firebase_client"
  }'
```

### Step 4: Send Notification to Self
```bash
curl -X POST http://localhost:8000/api/notification/send-to-self/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is my first push notification!"
  }'
```

---

## Getting FCM Token (Client Side)

### Android (Kotlin)
```kotlin
FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
    if (task.isSuccessful) {
        val token = task.result
        // Send this token to your backend
        Log.d("FCM Token", token)
    }
}
```

### iOS (Swift)
```swift
Messaging.messaging().token { token, error in
    if let error = error {
        print("Error fetching FCM token: \(error)")
    } else if let token = token {
        print("FCM token: \(token)")
        // Send this token to your backend
    }
}
```

### Web (JavaScript)
```javascript
import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();
getToken(messaging, { vapidKey: 'your-vapid-key' })
  .then((currentToken) => {
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      // Send this token to your backend
    }
  });
```

---

## Testing with Postman

1. **Register User:** POST to `/api/register/`
2. **Login:** POST to `/api/login/` and save the token
3. **Set Authorization:** Add header `Authorization: Token your_token`
4. **Register FCM Token:** POST to `/api/fcm/register/`
5. **Send Test Notification:** POST to `/api/notification/send-to-self/`

---

## Models

### User Model
- Custom user model with email authentication
- Fields: email, username, password, is_staff, is_active

### DeviceToken Model
- Stores FCM tokens for each user
- Fields: user_email (ForeignKey), device_token, created_at
- One token per user (enforced in business logic)

---

## Error Handling

Standard HTTP status codes:

- `200 OK` - Successful GET/POST requests
- `201 Created` - Successfully created resource
- `400 Bad Request` - Invalid data or validation errors
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found (e.g., no FCM token registered)
- `409 Conflict` - Resource already exists (e.g., FCM token already registered)
- `500 Internal Server Error` - Firebase or server error

---

## Security Best Practices

1. **Never expose your Firebase service account key** in public repositories
2. **Use environment variables** for sensitive configuration
3. **Implement rate limiting** for notification endpoints
4. **Validate FCM tokens** before storing
5. **Use HTTPS** in production
6. **Implement token refresh** logic for expired FCM tokens
7. **Add logging** for notification delivery tracking

---

## Broadcast Notification Features

The broadcast endpoint includes:
-  Individual notification tracking per user
-  Success/failure count and percentage
-  Detailed error reporting for failed notifications
-  Admin information logging
- Timestamp tracking
-  Console logging for debugging (`print` statements)

---

## Troubleshooting

### Common Issues

**Issue:** "No FCM token found for your account"
- **Solution:** Register your device token using `/api/fcm/register/` endpoint

**Issue:** "Invalid registration token"
- **Solution:** FCM tokens expire or become invalid. Re-register the device token

**Issue:** "User already has FCM token"
- **Solution:** Each user can only have one token. Delete the old token or update the logic to allow multiple devices

**Issue:** Firebase admin not initialized
- **Solution:** Ensure `firebase_admin.initialize_app()` is called before using messaging

---

## API Documentation

Access Swagger documentation at:
```
http://localhost:8000/swagger/
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is open source and available under the MIT License.

---

## Support

For questions or issues:
- Open an issue on GitHub
- Check Firebase documentation: https://firebase.google.com/docs/cloud-messaging

---

## Notes

- Replace `localhost:8000` with your actual domain in production
- Ensure Firebase project is properly configured
- Test notifications thoroughly before production deployment
- Monitor Firebase console for delivery statistics
- Consider implementing notification history/logging for audit trails

---

