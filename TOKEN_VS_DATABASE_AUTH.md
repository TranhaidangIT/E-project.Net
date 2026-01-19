# 🔐 JWT Token vs Database Authentication - So Sánh Chi Tiết

## 📋 Tổng Quan

Tài liệu này giải thích chi tiết về:
1. Cách hoạt động của JWT Token Authentication
2. Cách hoạt động của Database Session Authentication
3. So sánh ưu/nhược điểm của 2 phương pháp

---

## 🎫 PHƯƠNG PHÁP 1: JWT TOKEN AUTHENTICATION (Đang sử dụng)

### 1.1 JWT Token là gì?

**JWT (JSON Web Token)** là một chuỗi mã hóa chứa thông tin user, được ký số (signed) bởi server.

**Cấu trúc JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6ImFkbWluIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│────────── Header ──────────│───────── Payload ─────────│──────────── Signature ────────────│
```

**3 Phần của JWT:**
1. **Header**: Thuật toán mã hóa (HS256, RS256...)
2. **Payload**: Dữ liệu user (userId, username, isAdmin, exp...)
3. **Signature**: Chữ ký số để verify token chưa bị sửa đổi

---

### 1.2 Quy Trình JWT Authentication - Chi Tiết

#### 🔹 BƯỚC 1: ĐĂNG NHẬP (Login)

```
┌─────────────┐                                      ┌──────────────────┐
│   Client    │                                      │   ASP.NET Core   │
│  (Browser)  │                                      │   API Server     │
└──────┬──────┘                                      └────────┬─────────┘
       │                                                      │
       │  POST /api/auth/login                               │
       │  { username: "user1", password: "123456" }          │
       ├────────────────────────────────────────────────────►│
       │                                                      │
       │                              ┌────────────────────────────────────┐
       │                              │ 1. Tìm user trong DB (username)    │
       │                              │ 2. So sánh password hash (BCrypt)  │
       │                              │    BCrypt.Verify(password, hash)   │
       │                              └────────────────────────────────────┘
       │                                                      │
       │                              ┌────────────────────────────────────┐
       │                              │ 3. Tạo JWT Token:                  │
       │                              │    - userId: 1                     │
       │                              │    - username: "user1"             │
       │                              │    - isAdmin: false                │
       │                              │    - exp: 7 ngày sau               │
       │                              │                                    │
       │                              │ 4. Ký token bằng SecretKey         │
       │                              │    (HMAC SHA-256)                  │
       │                              └────────────────────────────────────┘
       │                                                      │
       │  Response:                                          │
       │  {                                                  │
       │    success: true,                                   │
       │    token: "eyJhbGciOiJIUzI1NiIsInR5...",          │
       │    user: { userId, username, email, isAdmin }      │
       │  }                                                  │
       │◄────────────────────────────────────────────────────┤
       │                                                      │
┌──────────────────────────────────────┐                    │
│ 5. Lưu token vào localStorage:        │                    │
│    localStorage.setItem('token', ...) │                    │
└──────────────────────────────────────┘                    │
```

**Code Backend (AuthService.cs):**
```csharp
public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDTO)
{
    // 1. Tìm user
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Username == loginDTO.Username);
    
    if (user == null)
        return new AuthResponseDTO { Success = false, Message = "Sai username" };
    
    // 2. Verify password
    if (!BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.PasswordHash))
        return new AuthResponseDTO { Success = false, Message = "Sai password" };
    
    // 3. Tạo JWT token
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim("userId", user.UserID.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("isAdmin", user.IsAdmin.ToString())
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        Issuer = _configuration["JwtSettings:Issuer"],
        Audience = _configuration["JwtSettings:Audience"],
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key), 
            SecurityAlgorithms.HmacSha256Signature
        )
    };
    
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);
    
    return new AuthResponseDTO
    {
        Success = true,
        Token = tokenString,
        User = new UserDTO { /* map user */ }
    };
}
```

---

#### 🔹 BƯỚC 2: GỬI REQUEST VỚI TOKEN

```
┌─────────────┐                                      ┌──────────────────┐
│   Client    │                                      │   API Server     │
└──────┬──────┘                                      └────────┬─────────┘
       │                                                      │
       │  GET /api/user/profile                              │
       │  Headers:                                           │
       │    Authorization: Bearer eyJhbGciOi...              │
       ├────────────────────────────────────────────────────►│
       │                                                      │
       │                              ┌────────────────────────────────────┐
       │                              │ JWT Middleware tự động:            │
       │                              │ 1. Lấy token từ header             │
       │                              │ 2. Verify signature (dùng SecretKey│
       │                              │ 3. Kiểm tra expiration             │
       │                              │ 4. Giải mã payload → Claims       │
       │                              │                                    │
       │                              │ KHÔNG CẦN TRUY VẤN DATABASE!      │
       │                              └────────────────────────────────────┘
       │                                                      │
       │                              ┌────────────────────────────────────┐
       │                              │ Controller nhận được:              │
       │                              │ - User.FindFirst("userId")         │
       │                              │ - User.Identity.Name (username)    │
       │                              │ - User.FindFirst("isAdmin")        │
       │                              │                                    │
       │                              │ Chỉ query DB nếu cần thêm data    │
       │                              └────────────────────────────────────┘
       │                                                      │
       │  Response: { userId, username, email, ... }         │
       │◄────────────────────────────────────────────────────┤
       │                                                      │
```

**Code Backend (UserController.cs):**
```csharp
[Authorize]
[HttpGet("profile")]
public async Task<IActionResult> GetProfile()
{
    // Token đã được validate bởi JWT Middleware
    // Extract userId từ Claims (KHÔNG CẦN query database để xác thực)
    var userIdClaim = User.FindFirst("userId")?.Value;
    if (string.IsNullOrEmpty(userIdClaim))
        return Unauthorized();
    
    int userId = int.Parse(userIdClaim);
    
    // Chỉ query DB để lấy thông tin mới nhất (không phải để xác thực)
    var user = await _authService.GetUserByIdAsync(userId);
    
    return Ok(user);
}
```

**Code Frontend (api.js):**
```javascript
// Axios tự động attach token vào mọi request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

#### 🔹 BƯỚC 3: TOKEN HẾT HẠN

```
┌─────────────┐                                      ┌──────────────────┐
│   Client    │                                      │   API Server     │
└──────┬──────┘                                      └────────┬─────────┘
       │                                                      │
       │  GET /api/user/profile                              │
       │  Authorization: Bearer [EXPIRED_TOKEN]              │
       ├────────────────────────────────────────────────────►│
       │                                                      │
       │                              ┌────────────────────────────────────┐
       │                              │ JWT Middleware:                    │
       │                              │ 1. Verify token                    │
       │                              │ 2. Check exp claim                 │
       │                              │ 3. Token đã hết hạn!              │
       │                              └────────────────────────────────────┘
       │                                                      │
       │  Response: 401 Unauthorized                         │
       │  { message: "Token expired" }                       │
       │◄────────────────────────────────────────────────────┤
       │                                                      │
┌──────────────────────────────────────┐                    │
│ Client xử lý:                         │                    │
│ 1. Xóa token                          │                    │
│ 2. Redirect đến /login                │                    │
└──────────────────────────────────────┘                    │
```

---

### 1.3 Ưu Điểm JWT Token

| Ưu điểm | Giải thích |
|---------|------------|
| ⚡ **Hiệu suất cao** | Không cần query database mỗi request để xác thực |
| 📈 **Scalable** | Stateless - server không lưu session, dễ scale horizontal |
| 🌐 **Cross-domain** | Token có thể dùng cho nhiều service/domain |
| 📦 **Self-contained** | Token chứa đủ thông tin, không cần tra cứu thêm |
| 🔄 **Microservices** | Phù hợp với kiến trúc microservices |

### 1.4 Nhược Điểm JWT Token

| Nhược điểm | Giải thích |
|-----------|------------|
| ❌ **Không revoke được** | Không thể thu hồi token trước khi hết hạn |
| 📦 **Token size lớn** | Token dài hơn session ID (vài trăm bytes) |
| 🔓 **Payload có thể đọc** | Không nên lưu thông tin nhạy cảm trong payload |
| ⏰ **Thay đổi role/permission** | Cần đợi token hết hạn hoặc force refresh |

---

## 💾 PHƯƠNG PHÁP 2: DATABASE SESSION AUTHENTICATION

### 2.1 Session là gì?

**Session** là dữ liệu user được lưu trữ trên server (thường trong database hoặc memory), client chỉ giữ **Session ID**.

---

### 2.2 Quy Trình Database Session Authentication - Chi Tiết

#### 🔹 BƯỚC 1: ĐĂNG NHẬP (Login)

```
┌─────────────┐                                      ┌──────────────────┐          ┌──────────┐
│   Client    │                                      │   API Server     │          │ Database │
└──────┬──────┘                                      └────────┬─────────┘          └────┬─────┘
       │                                                      │                          │
       │  POST /api/auth/login                               │                          │
       │  { username: "user1", password: "123456" }          │                          │
       ├────────────────────────────────────────────────────►│                          │
       │                                                      │                          │
       │                              ┌──────────────────────────────────────────────┐  │
       │                              │ 1. Tìm user trong DB                         │  │
       │                              └──────────────────────────────────────────────┘  │
       │                                                      │                          │
       │                                                      │  SELECT * FROM Users    │
       │                                                      │  WHERE Username = ?      │
       │                                                      ├─────────────────────────►│
       │                                                      │                          │
       │                                                      │  User data               │
       │                                                      │◄─────────────────────────┤
       │                                                      │                          │
       │                              ┌──────────────────────────────────────────────┐  │
       │                              │ 2. Verify password hash (BCrypt)             │  │
       │                              └──────────────────────────────────────────────┘  │
       │                                                      │                          │
       │                              ┌──────────────────────────────────────────────┐  │
       │                              │ 3. Tạo Session:                              │  │
       │                              │    - SessionID: UUID.randomUUID()            │  │
       │                              │    - UserID: 1                               │  │
       │                              │    - ExpiresAt: Now + 7 days                 │  │
       │                              │    - IPAddress, UserAgent, etc.              │  │
       │                              └──────────────────────────────────────────────┘  │
       │                                                      │                          │
       │                                                      │  INSERT INTO Sessions    │
       │                                                      │  (SessionID, UserID, ...)│
       │                                                      ├─────────────────────────►│
       │                                                      │                          │
       │                                                      │  Success                 │
       │                                                      │◄─────────────────────────┤
       │                                                      │                          │
       │  Response:                                          │                          │
       │  {                                                  │                          │
       │    success: true,                                   │                          │
       │    sessionId: "a1b2c3d4-...",                       │                          │
       │    user: { userId, username, ... }                  │                          │
       │  }                                                  │                          │
       │◄────────────────────────────────────────────────────┤                          │
       │                                                      │                          │
┌──────────────────────────────────────┐                    │                          │
│ Lưu sessionId vào localStorage        │                    │                          │
└──────────────────────────────────────┘                    │                          │
```

**Bảng Sessions trong Database:**
```sql
CREATE TABLE Sessions (
    SessionID VARCHAR(36) PRIMARY KEY,
    UserID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ExpiresAt DATETIME NOT NULL,
    IPAddress VARCHAR(45),
    UserAgent VARCHAR(500),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```

---

#### 🔹 BƯỚC 2: GỬI REQUEST VỚI SESSION ID

```
┌─────────────┐                                      ┌──────────────────┐          ┌──────────┐
│   Client    │                                      │   API Server     │          │ Database │
└──────┬──────┘                                      └────────┬─────────┘          └────┬─────┘
       │                                                      │                          │
       │  GET /api/user/profile                              │                          │
       │  Headers:                                           │                          │
       │    X-Session-ID: a1b2c3d4-...                       │                          │
       ├────────────────────────────────────────────────────►│                          │
       │                                                      │                          │
       │                              ┌──────────────────────────────────────────────┐  │
       │                              │ 1. Lấy sessionId từ header                   │  │
       │                              └──────────────────────────────────────────────┘  │
       │                                                      │                          │
       │                                                      │  SELECT s.*, u.*         │
       │                                                      │  FROM Sessions s          │
       │                                                      │  JOIN Users u             │
       │                                                      │  WHERE s.SessionID = ?    │
       │                                                      │  AND s.IsActive = 1       │
       │                                                      │  AND s.ExpiresAt > NOW() │
       │                                                      ├─────────────────────────►│
       │                              ⚠️ PHẢI QUERY DB MỖI REQUEST!                    │
       │                                                      │                          │
       │                                                      │  Session + User data     │
       │                                                      │◄─────────────────────────┤
       │                                                      │                          │
       │                              ┌──────────────────────────────────────────────┐  │
       │                              │ 2. Kiểm tra:                                 │  │
       │                              │    - Session tồn tại?                        │  │
       │                              │    - Chưa hết hạn?                           │  │
       │                              │    - IsActive = true?                        │  │
       │                              │    - User chưa bị khóa?                      │  │
       │                              └──────────────────────────────────────────────┘  │
       │                                                      │                          │
       │  Response: { userId, username, email, ... }         │                          │
       │◄────────────────────────────────────────────────────┤                          │
       │                                                      │                          │
```

**Code Backend với Session:**
```csharp
[HttpGet("profile")]
public async Task<IActionResult> GetProfile()
{
    var sessionId = Request.Headers["X-Session-ID"].FirstOrDefault();
    
    // PHẢI QUERY DATABASE MỖI REQUEST
    var session = await _context.Sessions
        .Include(s => s.User)
        .FirstOrDefaultAsync(s => 
            s.SessionID == sessionId && 
            s.IsActive && 
            s.ExpiresAt > DateTime.UtcNow
        );
    
    if (session == null)
        return Unauthorized();
    
    return Ok(new UserDTO { /* map from session.User */ });
}
```

---

#### 🔹 BƯỚC 3: ĐĂNG XUẤT (Logout)

```
┌─────────────┐                                      ┌──────────────────┐          ┌──────────┐
│   Client    │                                      │   API Server     │          │ Database │
└──────┬──────┘                                      └────────┬─────────┘          └────┬─────┘
       │                                                      │                          │
       │  POST /api/auth/logout                              │                          │
       │  X-Session-ID: a1b2c3d4-...                         │                          │
       ├────────────────────────────────────────────────────►│                          │
       │                                                      │                          │
       │                                                      │  UPDATE Sessions          │
       │                                                      │  SET IsActive = 0         │
       │                                                      │  WHERE SessionID = ?      │
       │                                                      ├─────────────────────────►│
       │                              ✅ SESSION BỊ VÔ HIỆU HÓA NGAY LẬP TỨC          │
       │                                                      │                          │
       │                                                      │  Success                 │
       │                                                      │◄─────────────────────────┤
       │                                                      │                          │
       │  Response: { success: true }                        │                          │
       │◄────────────────────────────────────────────────────┤                          │
       │                                                      │                          │
```

---

### 2.3 Ưu Điểm Database Session

| Ưu điểm | Giải thích |
|---------|------------|
| ✅ **Revoke ngay lập tức** | Có thể vô hiệu hóa session bất cứ lúc nào (logout, ban user) |
| 🔒 **Kiểm soát chặt chẽ** | Luôn check database → thông tin real-time |
| 📊 **Tracking chi tiết** | Lưu IP, User Agent, login time, activity log |
| 👥 **Multi-device management** | Quản lý nhiều session của 1 user (xem/xóa từng device) |
| 🔐 **Security** | Session ID ngẫu nhiên, không chứa thông tin |

### 2.4 Nhược Điểm Database Session

| Nhược điểm | Giải thích |
|-----------|------------|
| ⚠️ **Phải query DB mỗi request** | Hiệu suất kém hơn JWT (database overhead) |
| 📉 **Khó scale** | Stateful - cần sticky session hoặc shared session storage |
| 💾 **Database load cao** | Mỗi API call = 1 SELECT query |
| 🗑️ **Session cleanup** | Cần cronjob để xóa session hết hạn |

---

## ⚖️ SO SÁNH JWT TOKEN vs DATABASE SESSION

### 3.1 Bảng So Sánh Tổng Quan

| Tiêu chí | JWT Token | Database Session |
|----------|-----------|------------------|
| **Lưu trữ trên Server** | ❌ Không (Stateless) | ✅ Có (Stateful) |
| **Query DB mỗi request** | ❌ Không cần | ✅ Phải query |
| **Revoke trước hết hạn** | ❌ Không thể | ✅ Dễ dàng |
| **Scalability** | ⭐⭐⭐⭐⭐ Rất tốt | ⭐⭐⭐ Khó hơn |
| **Performance** | ⭐⭐⭐⭐⭐ Nhanh | ⭐⭐⭐ Chậm hơn |
| **Security** | ⭐⭐⭐⭐ Tốt | ⭐⭐⭐⭐⭐ Rất tốt |
| **Complexity** | ⭐⭐⭐ Đơn giản | ⭐⭐⭐⭐ Phức tạp hơn |
| **Token/Session size** | 🔴 Lớn (200-500 bytes) | 🟢 Nhỏ (36 bytes UUID) |
| **Cross-domain** | ✅ Dễ dàng | ⚠️ Phức tạp hơn |
| **Real-time data** | ⚠️ Cũ (đến khi hết hạn) | ✅ Luôn mới nhất |

---

### 3.2 So Sánh Hiệu Suất (Performance)

#### Scenario: 1000 requests/giây đến API `/user/profile`

**JWT Token:**
```
Request → JWT Middleware (verify signature) → Controller
         └── ⚡ 0.1ms (chỉ verify signature, không query DB)
         
Database queries: 0 (nếu không cần data mới)
Server load: Thấp
Response time: ~10-50ms
```

**Database Session:**
```
Request → Session Middleware → Query DB → Verify → Controller
         └── 🐢 5-50ms (query Sessions + JOIN Users)
         
Database queries: 1000 queries/giây
Server load: Cao (database bottleneck)
Response time: ~50-200ms
```

**Kết luận:** JWT nhanh hơn **5-20 lần** do không phải query database.

---

### 3.3 So Sánh Kịch Bản Thực Tế

#### 📌 Kịch bản 1: User đổi mật khẩu

**JWT Token:**
```
1. User đổi password thành công
2. ⚠️ Các token cũ VẪN VALID cho đến khi hết hạn (7 ngày)
3. Cần force refresh token hoặc blacklist token cũ (phức tạp)
```

**Database Session:**
```
1. User đổi password thành công
2. ✅ XÓA TẤT CẢ SESSION của user trong DB
3. Token cũ NGAY LẬP TỨC không dùng được
```
**Winner: 🏆 Database Session**

---

#### 📌 Kịch bản 2: Admin ban user

**JWT Token:**
```
1. Admin set user.IsActive = false
2. ⚠️ User vẫn dùng được token cũ cho đến hết hạn
3. Cần thêm bảng TokenBlacklist hoặc check DB trong middleware
```

**Database Session:**
```
1. Admin set user.IsActive = false
2. UPDATE Sessions SET IsActive = 0 WHERE UserID = ?
3. ✅ User NGAY LẬP TỨC bị kick out
```
**Winner: 🏆 Database Session**

---

#### 📌 Kịch bản 3: Microservices (nhiều service)

**JWT Token:**
```
Service A, B, C đều có thể verify token
└── Chỉ cần SecretKey (không cần share database)
✅ Dễ dàng scale
```

**Database Session:**
```
Service A, B, C đều phải truy cập chung 1 Sessions database
└── Hoặc dùng Redis để share session (thêm complexity)
⚠️ Khó scale hơn
```
**Winner: 🏆 JWT Token**

---

#### 📌 Kịch bản 4: Mobile App (offline mode)

**JWT Token:**
```
App lưu token, có thể verify offline (nếu dùng RSA public key)
✅ User vẫn access được app khi mất mạng
```

**Database Session:**
```
Mỗi request phải query DB
⚠️ Không hoạt động khi offline
```
**Winner: 🏆 JWT Token**

---

#### 📌 Kịch bản 5: High traffic website (1M users online)

**JWT Token:**
```
1M users → 0 database queries cho authentication
✅ Server chỉ cần verify signature
⚡ Hiệu suất cao
```

**Database Session:**
```
1M users → 1M database queries liên tục
⚠️ Database sẽ quá tải
🐢 Cần cache (Redis) để giảm load
```
**Winner: 🏆 JWT Token**

---

## 🎯 KẾT LUẬN & KHUYẾN NGHỊ

### Khi nào dùng JWT Token? ✅

- ✅ Ứng dụng high traffic (cần hiệu suất cao)
- ✅ Microservices / Distributed systems
- ✅ RESTful API stateless
- ✅ Mobile apps
- ✅ Cross-domain authentication
- ✅ Không cần revoke token thường xuyên

### Khi nào dùng Database Session? ✅

- ✅ Cần kiểm soát session chặt chẽ
- ✅ Cần revoke token ngay lập tức
- ✅ Web app truyền thống (monolithic)
- ✅ Ứng dụng banking/security cao
- ✅ Cần tracking chi tiết user activity
- ✅ Multi-device management

### Giải pháp Hybrid (Kết hợp cả 2) 🔥

Nhiều hệ thống lớn dùng **JWT + Redis Blacklist**:

```
1. Dùng JWT cho authentication (hiệu suất cao)
2. Lưu blacklist token trong Redis khi cần revoke
3. Middleware kiểm tra token có trong blacklist không

Ưu điểm:
- ✅ Hiệu suất JWT (không query DB thường xuyên)
- ✅ Có thể revoke token khi cần (check Redis rất nhanh)
- ✅ Best of both worlds
```

---

## 📊 CODE EXAMPLES

### JWT Authentication (Hiện tại đang dùng)

**appsettings.json:**
```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration2024!@#$%",
    "Issuer": "MusicWebAPI",
    "Audience": "MusicWebClient",
    "ExpirationInDays": 7
  }
}
```

**Program.cs:**
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)
            )
        };
    });
```

---

### Database Session Authentication (Nếu muốn chuyển sang)

**Migration:**
```sql
CREATE TABLE Sessions (
    SessionID VARCHAR(36) PRIMARY KEY,
    UserID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ExpiresAt DATETIME NOT NULL,
    LastActivityAt DATETIME DEFAULT GETDATE(),
    IPAddress VARCHAR(45),
    UserAgent VARCHAR(500),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE INDEX IX_Sessions_UserID ON Sessions(UserID);
CREATE INDEX IX_Sessions_ExpiresAt ON Sessions(ExpiresAt);
```

**SessionService.cs:**
```csharp
public class SessionService
{
    public async Task<string> CreateSessionAsync(int userId, string ipAddress, string userAgent)
    {
        var sessionId = Guid.NewGuid().ToString();
        var session = new Session
        {
            SessionID = sessionId,
            UserID = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IPAddress = ipAddress,
            UserAgent = userAgent,
            IsActive = true
        };
        
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();
        
        return sessionId;
    }
    
    public async Task<User?> ValidateSessionAsync(string sessionId)
    {
        return await _context.Sessions
            .Include(s => s.User)
            .Where(s => s.SessionID == sessionId && 
                        s.IsActive && 
                        s.ExpiresAt > DateTime.UtcNow)
            .Select(s => s.User)
            .FirstOrDefaultAsync();
    }
    
    public async Task RevokeSessionAsync(string sessionId)
    {
        var session = await _context.Sessions.FindAsync(sessionId);
        if (session != null)
        {
            session.IsActive = false;
            await _context.SaveChangesAsync();
        }
    }
}
```

---

## 🔗 Tài Liệu Tham Khảo

- [JWT.io - Introduction to JSON Web Tokens](https://jwt.io/introduction)
- [Microsoft Docs - ASP.NET Core JWT Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/)
- [OWASP - Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

*Tài liệu được tạo: 18/01/2026*
*Project: Music Web - E-project.Net*
