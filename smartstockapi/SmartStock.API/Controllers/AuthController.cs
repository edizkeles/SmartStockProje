using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStock.DataAccess.Context;
using SmartStock.Entity.Concrete;

namespace SmartStock.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Kullanıcı adı ve şifre boş bırakılamaz.");
            }

            var user = await _context.Kullanicilar.FirstOrDefaultAsync(
                u => u.Username.ToLower() == dto.Username.Trim().ToLower() && u.Password == dto.Password
            );

            if (user == null)
            {
                return BadRequest("Kullanıcı adı veya şifre hatalı!");
            }

            return Ok(new
            {
                username = user.Username,
                role = user.Role
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Kullanıcı adı ve şifre boş bırakılamaz.");
            }

            var normalizedUsername = dto.Username.Trim();
            if (normalizedUsername.ToLower() == "admin")
            {
                return BadRequest("Bu kullanıcı adı ile kayıt olunamaz.");
            }

            var exists = await _context.Kullanicilar.AnyAsync(
                u => u.Username.ToLower() == normalizedUsername.ToLower()
            );

            if (exists)
            {
                return BadRequest("Bu kullanıcı adı zaten alınmış!");
            }

            var newUser = new Kullanici
            {
                Username = normalizedUsername,
                Password = dto.Password,
                Role = "customer"
            };

            await _context.Kullanicilar.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }

    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
