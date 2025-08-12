# 🎬 MovieDB - Website Xem Phim với HTTP Client/Server Tự Xây Dựng

Dự án Lab01 - Nhóm 16: Triển khai website xem phim với HTTP client/server tự xây dựng, tích hợp TheMovieDB API.

## 🚀 Tính Năng Chính

### ✨ Giao Diện Người Dùng

- **Responsive Design**: Giao diện đẹp mắt, tương thích mọi thiết bị
- **Hero Section**: Trang chủ với gradient background và call-to-action buttons
- **Navigation**: Menu điều hướng mượt mà với smooth scrolling
- **Movie Grid**: Hiển thị phim dạng grid với hover effects
- **Search Functionality**: Tìm kiếm phim theo tên
- **Modal Details**: Xem chi tiết phim với thông tin đầy đủ

### 🔧 Backend API

- **Express.js Server**: Server HTTP với routing và middleware
- **TheMovieDB Integration**: Tích hợp API để lấy dữ liệu phim
- **Custom HTTP Client**: HTTP client tự xây dựng (không dùng axios/fetch)
- **Error Handling**: Xử lý lỗi 404, 500 và các trường hợp khác
- **Custom Headers**: Response headers tùy chỉnh

### 📊 Server Monitoring

- **Server Info**: Hiển thị thông tin server real-time
- **Performance Metrics**: Theo dõi memory usage, uptime, Node version
- **Network Monitoring**: Giám sát network traffic và performance

## 🏗️ Cấu Trúc Dự Án

```
lab01-nhom16/
├── README.md                 # Hướng dẫn sử dụng
├── package.json             # Dependencies và scripts
├── server.js               # Express server chính
├── client.js               # HTTP client testing
├── monitor.js              # Network monitoring
├── public/                 # Static files
│   ├── index.html         # Trang chủ HTML
│   ├── style.css          # CSS styling
│   └── script.js          # Client-side JavaScript
├── screenshots/            # Screenshots demo
├── docs/                   # Tài liệu kỹ thuật
└── presentation/           # Slides thuyết trình
```

## 🛠️ Cài Đặt và Chạy

### Yêu Cầu Hệ Thống

- Node.js (version 14+)
- npm hoặc yarn
- Internet connection để truy cập TheMovieDB API

### Bước 1: Clone và Cài Đặt

```bash
# Clone repository
git clone <repository-url>
cd lmao_phim

# Cài đặt dependencies
npm install
```

### Bước 2: Chạy Server

```bash
# Chạy server development mode
npm run dev

# Hoặc chạy production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### Bước 3: Chạy Tests

```bash
# Test HTTP client
npm test

# Test network monitoring
npm run monitor
```

## 📱 Sử Dụng Website

### 🏠 Trang Chủ

- Xem thông tin server real-time
- Nút gọi API để lấy dữ liệu phim
- Navigation đến các section khác

### 🔥 Phim Xu Hướng

- Hiển thị danh sách phim xu hướng từ TheMovieDB
- Click vào phim để xem chi tiết
- Responsive grid layout

### ⭐ Phim Phổ Biến

- Danh sách phim phổ biến với pagination
- Chuyển trang trước/sau
- Loading states và error handling

### 🔍 Tìm Kiếm Phim

- Tìm kiếm theo tên phim
- Kết quả real-time
- Hiển thị số lượng kết quả tìm thấy

### 🎬 Chi Tiết Phim

- Modal hiển thị thông tin chi tiết
- Poster, backdrop, cast, videos
- Thông tin rating, genres, runtime

## 🧪 Testing và Monitoring

### HTTP Client Testing

```bash
# Test local server
node client.js

# Test với external APIs
# - GitHub API
# - JSONPlaceholder API
# - Error handling scenarios
```

### Network Monitoring

```bash
# Test monitoring
node monitor.js

# Continuous monitoring
node monitor.js --continuous
```

### Performance Metrics

- Response time tracking
- Success/failure rates
- File size analysis
- Request type distribution

## 🔌 API Endpoints

### Server Info

```
GET /api/server-info
```

Trả về thông tin server: timestamp, memory usage, Node version, uptime

### Movies

```
GET /api/trending-movies
GET /api/popular-movies?page=1
GET /api/search-movies?query=avengers
GET /api/movie/:id
```

### Response Format

```json
{
  "success": true,
  "data": [...],
  "total_results": 100,
  "total_pages": 5
}
```

## 🎨 Custom HTTP Client

### Features

- **Built-in Modules Only**: Không sử dụng axios/fetch
- **HTTP/HTTPS Support**: Hỗ trợ cả HTTP và HTTPS
- **GET/POST Methods**: Implement đầy đủ HTTP methods
- **Error Handling**: Xử lý timeout, network errors
- **Custom Headers**: Hỗ trợ custom request headers

### Usage

```javascript
const client = new CustomHTTPClient();

// GET request
const response = await client.get("http://localhost:3000/api/server-info");

// POST request
const postResponse = await client.post("https://api.example.com/posts", {
  title: "Test Post",
  body: "Test Body",
});
```

## 📊 Network Analysis

### Browser Developer Tools

1. Mở Chrome DevTools (F12)
2. Chuyển đến Network tab
3. Reload trang và quan sát requests
4. Phân tích response times, file sizes

### Monitoring Script

- Real-time performance tracking
- Request/response logging
- Performance reports generation
- Session management

## 🚀 Performance Features

### Optimization

- **Lazy Loading**: Images load khi cần thiết
- **Efficient Rendering**: DOM manipulation tối ưu
- **Caching**: Browser caching cho static files
- **Compression**: Response compression

### Metrics

- Page load time
- API response time
- Memory usage
- Network throughput

## 🔒 Security Features

### API Security

- **API Key Management**: Secure API key handling
- **Rate Limiting**: Request throttling
- **Input Validation**: Sanitize user inputs
- **Error Handling**: Secure error messages

### Server Security

- **Custom Headers**: Security headers
- **CORS Configuration**: Cross-origin handling
- **Request Validation**: Input sanitization

## 📱 Responsive Design

### Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

### Features

- Flexible grid layouts
- Mobile-first approach
- Touch-friendly interactions
- Optimized typography

## 🎯 Tính Năng Nâng Cao

### Bonus Features

- **Performance Benchmarking**: So sánh hiệu suất
- **Custom TCP Server**: TCP server implementation
- **WebSocket Demo**: Real-time communication
- **HTTPS Support**: Self-signed certificates

## 🐛 Troubleshooting

### Common Issues

1. **Server không start**: Kiểm tra port 3000 có bị chiếm không
2. **API errors**: Kiểm tra TheMovieDB API key
3. **CORS issues**: Kiểm tra browser console
4. **Performance issues**: Sử dụng monitoring script

### Debug Commands

```bash
# Check server status
curl http://localhost:3000/api/server-info

# Monitor network
node monitor.js --continuous

# Test specific endpoint
node client.js
```

## 📈 Performance Benchmarks

### Test Results

- **Server Startup**: < 2 seconds
- **API Response**: < 500ms average
- **Page Load**: < 3 seconds
- **Memory Usage**: < 100MB

### Optimization Tips

- Use connection pooling
- Implement caching strategies
- Optimize database queries
- Monitor memory leaks

## 🤝 Contributing

### Development Workflow

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards

- ES6+ syntax
- Consistent formatting
- Error handling
- Documentation

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 👥 Team

**Nhóm 16** - HTTP Client/Server Implementation

### Members

- 2212375 - Triệu Quang Học
- 2212343 - Đinh Lâm Gia Bảo
- 2100011 - Nguyễn Đoan Trang

## 🙏 Acknowledgments

- TheMovieDB API team
- Express.js community
- Node.js contributors
- Font Awesome icons

---

**⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star! ⭐**
