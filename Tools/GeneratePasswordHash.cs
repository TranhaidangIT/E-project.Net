using BCrypt.Net;

// =============================================
// TOOL TẠO PASSWORD HASH CHO SUPER ADMIN
// =============================================

// Super Admin credentials
string username = "superadmin";
string password = "Super@2024";
string email = "superadmin@musicweb.com";
string fullName = "Super Administrator";

string hash = BCrypt.Net.BCrypt.HashPassword(password);

Console.WriteLine("========================================");
Console.WriteLine("   SUPER ADMIN PASSWORD HASH           ");
Console.WriteLine("========================================\n");

Console.WriteLine($"Username: {username}");
Console.WriteLine($"Password: {password}");
Console.WriteLine($"Hash:     {hash}");

Console.WriteLine("\n========================================");
Console.WriteLine("COPY SQL NÀY VÀO DATABASE:");
Console.WriteLine("========================================\n");

Console.WriteLine($@"DELETE FROM Users;

INSERT INTO Users (Username, Email, PasswordHash, FullName, IsAdmin) 
VALUES (N'{username}', N'{email}', N'{hash}', N'{fullName}', 1);

SELECT * FROM Users;");

Console.WriteLine("\n========================================");
Console.WriteLine($"ĐĂNG NHẬP: {username} / {password}");
Console.WriteLine("========================================");

