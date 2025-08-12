# Kiến Trúc Hệ Thống - Lmao Phim

## Tổng Quan Hệ Thống

Lmao Phim là một website xem phim được xây dựng với kiến trúc client-server, sử dụng Node.js và Express.js cho backend, và vanilla JavaScript cho frontend. Hệ thống được thiết kế để minh họa việc xây dựng HTTP client/server từ đầu mà không sử dụng các thư viện có sẵn.

## Sơ Đồ Kiến Trúc

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Browser)     │◄──►│   (Node.js)     │◄──►│   (TheMovieDB)  │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │    │ • Express.js    │    │ • Movie API     │
│ • Custom HTTP   │    │ • Custom HTTP   │    │ • Image CDN     │
│   Client        │    │   Client        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Các Thành Phần Chính

### 1. Frontend (Client-Side)

#### **HTML Structure (`public/index.html`)**

- **Mục đích**: Giao diện người dùng chính
- **Chức năng**:
  - Hiển thị thông tin server
  - Danh sách phim xu hướng và phổ biến
  - Tìm kiếm phim
  - Modal hiển thị chi tiết phim

#### **CSS Styling (`public/style.css`)**

- **Mục đích**: Định dạng giao diện và responsive design
- **Chức năng**:
  - Layout responsive với CSS Grid và Flexbox
  - Dark theme với màu sắc xanh dương
  - Animation và transition effects
  - Mobile-first design

#### **JavaScript Logic (`public/script.js`)**

- **Mục đích**: Xử lý logic nghiệp vụ và tương tác người dùng
- **Chức năng**:
  - Custom HTTP client sử dụng XMLHttpRequest
  - Quản lý state và UI updates
  - Xử lý sự kiện người dùng
  - Tích hợp với API backend

### 2. Backend (Server-Side)

#### **Express Server (`server.js`)**

- **Mục đích**: HTTP server chính xử lý requests
- **Chức năng**:
  - Static file serving
  - API endpoints
  - Custom HTTP client cho external APIs
  - Error handling middleware
  - Custom headers

#### **Custom HTTP Client (`client.js`)**

- **Mục đích**: HTTP client Node.js để test và monitoring
- **Chức năng**:
  - GET/POST requests
  - HTTP/HTTPS support
  - Error handling
  - Performance testing

#### **Network Monitor (`monitor.js`)**

- **Mục đích**: Giám sát hiệu suất mạng
- **Chức năng**:
  - Request tracking
  - Performance metrics
  - Logging và reporting

### 3. External Services

#### **TheMovieDB API**

- **Mục đích**: Cung cấp dữ liệu phim
- **Chức năng**:
  - Trending movies
  - Popular movies
  - Movie details
  - Search functionality
  - Cast và video information

## Luồng Dữ Liệu

### 1. Khởi tạo Trang

```
User truy cập → Server trả HTML/CSS/JS → Page load → Hiển thị loading state
```

### 2. Cập Nhật Thông Tin

```
User click "Cập nhật tất cả thông tin" →
Frontend gọi API →
Backend xử lý →
Backend gọi TheMovieDB →
Trả dữ liệu về Frontend →
Cập nhật UI
```

### 3. Tìm Kiếm Phim

```
User nhập từ khóa →
Frontend gọi search API →
Backend gọi TheMovieDB search →
Trả kết quả về →
Hiển thị danh sách phim
```

### 4. Xem Chi Tiết Phim

```
User click vào phim →
Frontend gọi movie details API →
Backend gọi TheMovieDB movie API →
Trả thông tin chi tiết →
Hiển thị modal
```

## Công Nghệ Sử Dụng

### **Backend Technologies**

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Built-in modules**: http, https, path, fs
- **Custom implementations**: HTTP client, error handling

### **Frontend Technologies**

- **Vanilla JavaScript**: Không sử dụng framework
- **XMLHttpRequest**: Custom HTTP client
- **CSS3**: Modern styling và animations
- **HTML5**: Semantic markup

### **Development Tools**

- **Nodemon**: Auto-restart server
- **Git**: Version control
- **npm**: Package management

## Bảo Mật và Performance

### **Bảo Mật**

- API key được lưu trong server (không expose ra client)
- Input validation và sanitization
- Error handling không leak thông tin nhạy cảm

### **Performance**

- Lazy loading cho images
- Debounced search
- Efficient DOM manipulation
- Optimized API calls

## Khả Năng Mở Rộng

### **Horizontal Scaling**

- Stateless server design
- External API integration
- Modular architecture

### **Vertical Scaling**

- Efficient memory usage
- Optimized database queries (nếu có)
- Caching strategies

## Monitoring và Logging

### **Performance Monitoring**

- Request/response times
- Memory usage tracking
- Error rate monitoring
- User interaction analytics

### **Logging**

- Server logs
- API request logs
- Error logs
- Performance metrics
