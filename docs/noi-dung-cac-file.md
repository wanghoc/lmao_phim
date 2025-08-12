# Nội Dung Các File - Lmao Phim

## Tổng Quan

Tài liệu này giải thích chi tiết nội dung và chức năng của từng file trong dự án Lmao Phim. Mỗi file được thiết kế để thực hiện một nhiệm vụ cụ thể trong hệ thống.

## File Cấu Hình Dự Án

### **`package.json`**

- **Mục đích**: Cấu hình dự án Node.js và quản lý dependencies
- **Nội dung chính**:
  - Metadata dự án (tên, phiên bản, mô tả)
  - Scripts để chạy và test ứng dụng
  - Dependencies: Express.js cho web server
  - DevDependencies: Nodemon cho development
- **Chức năng**:
  - Khởi tạo dự án Node.js
  - Quản lý packages và scripts
  - Cấu hình build và deployment

### **`.gitignore`**

- **Mục đích**: Chỉ định các file/thư mục Git nên bỏ qua
- **Nội dung chính**:
  - Node modules
  - Log files
  - Environment variables
  - Build artifacts
- **Chức năng**:
  - Tránh commit các file không cần thiết
  - Bảo mật thông tin nhạy cảm

## File Backend (Server-Side)

### **`server.js`**

- **Mục đích**: File chính của Express server
- **Nội dung chính**:
  - Khởi tạo Express app
  - Middleware configuration
  - Static file serving
  - API routes
  - Custom HTTP client implementation
  - Error handling
- **Chức năng**:
  - HTTP server chạy trên port 3000
  - Phục vụ static files (HTML, CSS, JS)
  - Xử lý API requests
  - Tích hợp với TheMovieDB API
  - Custom headers và error responses

### **`client.js`**

- **Mục đích**: HTTP client Node.js để test và development
- **Nội dung chính**:
  - CustomHTTPClient class
  - GET/POST method implementations
  - HTTP/HTTPS protocol support
  - Error handling và timeout
  - Test scenarios
- **Chức năng**:
  - Test local server endpoints
  - Test external APIs
  - Performance testing
  - Error simulation

### **`monitor.js`**

- **Mục đích**: Network monitoring và performance tracking
- **Nội dung chính**:
  - NetworkMonitor class
  - Request tracking
  - Performance metrics
  - Logging và reporting
  - Continuous monitoring
- **Chức năng**:
  - Theo dõi hiệu suất mạng
  - Ghi log requests/responses
  - Tạo báo cáo performance
  - Real-time monitoring

## File Frontend (Client-Side)

### **`public/index.html`**

- **Mục đích**: Giao diện người dùng chính
- **Nội dung chính**:
  - HTML structure với semantic markup
  - Navigation menu
  - Hero section
  - Server info section
  - Trending movies section
  - Popular movies section
  - Search functionality
  - Movie details modal
- **Chức năng**:
  - Layout chính của website
  - Responsive design structure
  - Integration với CSS và JavaScript
  - Accessibility features

### **`public/style.css`**

- **Mục đích**: Styling và responsive design
- **Nội dung chính**:
  - CSS reset và base styles
  - Header và navigation styles
  - Hero section styling
  - Button và form styles
  - Movie card layouts
  - Modal styling
  - Responsive breakpoints
  - Animation và transitions
- **Chức năng**:
  - Định dạng giao diện
  - Responsive design
  - Dark theme
  - Interactive effects
  - Mobile optimization

### **`public/script.js`**

- **Mục đích**: Client-side logic và interactions
- **Nội dung chính**:
  - CustomHTTPClient class
  - Server info functions
  - Movie loading functions
  - Search functionality
  - Modal management
  - Event handlers
  - Utility functions
- **Chức năng**:
  - HTTP requests handling
  - UI state management
  - User interaction processing
  - API integration
  - Dynamic content loading

## File Tài Liệu

### **`README.md`**

- **Mục đích**: Tài liệu chính của dự án
- **Nội dung chính**:
  - Mô tả dự án
  - Hướng dẫn cài đặt
  - Cách sử dụng
  - Cấu trúc dự án
  - API documentation
- **Chức năng**:
  - Giới thiệu dự án
  - Hướng dẫn developer
  - API reference
  - Troubleshooting

### **`docs/technical-report.md`**

- **Mục đích**: Báo cáo kỹ thuật chi tiết
- **Nội dung chính**:
  - Tổng quan dự án
  - Mục tiêu và yêu cầu
  - Kiến trúc hệ thống
  - Implementation details
  - Testing và validation
- **Chức năng**:
  - Technical documentation
  - Implementation guide
  - Best practices
  - Lessons learned

### **`docs/kien-truc-he-thong.md`**

- **Mục đích**: Mô tả kiến trúc hệ thống
- **Nội dung chính**:
  - System overview
  - Component architecture
  - Data flow
  - Technology stack
  - Scaling considerations
- **Chức năng**:
  - Architecture documentation
  - System design
  - Component relationships
  - Technical decisions

## Thư Mục Đặc Biệt

### **`public/`**

- **Mục đích**: Chứa các file static cho frontend
- **Nội dung**:
  - HTML, CSS, JavaScript files
  - Images và assets
  - Font files (nếu có)
- **Chức năng**:
  - Static file serving
  - Frontend resources
  - Client-side assets

### **`screenshots/`**

- **Mục đích**: Lưu trữ screenshots cho documentation
- **Nội dung**:
  - Network analysis screenshots
  - Server running screenshots
  - API response screenshots
- **Chức năng**:
  - Visual documentation
  - Testing evidence
  - User guide support

### **`docs/`**

- **Mục đích**: Chứa tài liệu kỹ thuật
- **Nội dung**:
  - Technical documentation
  - Architecture diagrams
  - Implementation guides
  - API references
- **Chức năng**:
  - Project documentation
  - Developer resources
  - Knowledge base

## Mối Quan Hệ Giữa Các File

### **Dependency Flow**

```
package.json → server.js → public/* → browser
     ↓
client.js → server.js (testing)
     ↓
monitor.js → server.js (monitoring)
```

### **Data Flow**

```
index.html → script.js → server.js → TheMovieDB API
     ↓
style.css → visual presentation
     ↓
server.js → static file serving
```