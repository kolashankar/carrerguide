# Admin Dashboard Setup Guide

## Adding Admin Credentials

To access the admin dashboard, you need to create admin credentials in the database.

### Option 1: Using the seed_admin.py Script

We provide a convenient script to seed admin credentials into the database.

**Steps:**

1. **Navigate to the backend directory:**
   ```bash
   cd /app/backend
   ```

2. **Update the admin credentials in `seed_admin.py`:**
   
   Open `/app/backend/seed_admin.py` and modify the admin details:
   ```python
   admin_email = "your-email@example.com"
   admin_password = "your-secure-password"
   admin_name = "Your Full Name"
   ```

3. **Run the seed script:**
   ```bash
   python seed_admin.py
   ```

4. **Verify the admin was created:**
   The script will output a success message with the admin details.

### Option 2: Using the API Endpoint

You can also register an admin using the API endpoint directly.

**Using curl:**

```bash
curl -X POST http://localhost:8001/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-secure-password",
    "full_name": "Your Full Name"
  }'
```

**Using Python requests:**

```python
import requests

response = requests.post(
    'http://localhost:8001/api/auth/admin/register',
    json={
        'email': 'your-email@example.com',
        'password': 'your-secure-password',
        'full_name': 'Your Full Name'
    }
)

print(response.json())
```

### Option 3: Direct MongoDB Insertion

For advanced users, you can insert admin credentials directly into MongoDB.

**Steps:**

1. **Connect to MongoDB:**
   ```bash
   mongo <your-mongodb-connection-string>
   ```

2. **Switch to your database:**
   ```javascript
   use career_guide_db
   ```

3. **Insert admin document:**
   ```javascript
   db.users.insertOne({
     email: "your-email@example.com",
     password: "<hashed-password>",  // Must be bcrypt hashed
     full_name: "Your Full Name",
     user_type: "admin",
     role: "admin",
     is_active: true,
     created_at: new Date()
   })
   ```

   **Note:** The password must be bcrypt hashed. You can use a tool like:
   ```bash
   python -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('your-password'))"
   ```

## Accessing the Admin Dashboard

1. **Start the backend server** (if not already running):
   ```bash
   sudo supervisorctl restart backend
   ```

2. **Start the admin dashboard frontend** (if not already running):
   ```bash
   cd /app/admin_dashboard/frontend
   yarn dev
   ```

3. **Open the admin dashboard:**
   - Development: http://localhost:3002
   - Production: Your deployed URL

4. **Login with your credentials:**
   - Email: The email you registered
   - Password: The password you set

## Default Admin Credentials (for testing)

If you used the default `seed_admin.py` script, the credentials might be:
- **Email:** admin@careerguide.com
- **Password:** admin123

**⚠️ Important:** Change these credentials immediately in production!

## Troubleshooting

### "Invalid credentials" error
- Verify the email and password are correct
- Check if the admin was successfully created in the database
- Ensure the backend server is running
- Check backend logs: `tail -n 50 /var/log/supervisor/backend.err.log`

### "Network error" message
- Ensure the backend server is running on port 8001
- Check if `NEXT_PUBLIC_API_URL` is correctly set in `/app/admin_dashboard/frontend/.env`
- Verify CORS is enabled in the backend

### Cannot access dashboard after login
- Clear browser localStorage and try again
- Check browser console for errors
- Verify the JWT token is being stored correctly

## Security Best Practices

1. **Use strong passwords** with a mix of uppercase, lowercase, numbers, and symbols
2. **Change default credentials** immediately in production
3. **Limit admin access** to trusted personnel only
4. **Enable 2FA** if available in your production setup
5. **Regularly rotate passwords** and access tokens
6. **Monitor admin activity** through analytics and logs

## Need Help?

If you encounter any issues, please:
1. Check the backend logs: `tail -n 100 /var/log/supervisor/backend.err.log`
2. Check the frontend logs in browser console
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

---

**Last Updated:** 2025
