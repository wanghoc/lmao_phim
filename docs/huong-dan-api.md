# Hướng Dẫn Sử Dụng API - Lmao Phim

## Tổng Quan

Lmao Phim cung cấp một tập hợp các API endpoints để tương tác với hệ thống. Tài liệu này mô tả chi tiết cách sử dụng từng API endpoint, bao gồm request/response format, parameters và examples.

## Base URL

```
http://localhost:3000
```

## Authentication

Hiện tại, API không yêu cầu authentication. Tuy nhiên, một số endpoints có thể yêu cầu API key trong tương lai.

## Response Format

Tất cả API responses đều tuân theo format chuẩn:

```json
{
  "success": true/false,
  "data": {...},
  "message": "Thông báo",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### 1. Server Information

#### **GET /api/server-info**

Lấy thông tin về server và hệ thống.

**Request:**

```http
GET /api/server-info
```

**Response:**

```json
{
  "success": true,
  "data": {
    "serverTime": "2024-01-01 12:00:00",
    "memoryUsage": {
      "heapUsed": 12345678,
      "heapTotal": 23456789,
      "external": 3456789
    },
    "nodeVersion": "v18.17.0",
    "uptime": 3600,
    "platform": "win32",
    "arch": "x64"
  },
  "message": "Server information retrieved successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Headers:**

- `X-Server-Info`: MovieDB-Express-Server
- `X-Request-Time`: Timestamp của request
- `X-API-Version`: 1.0.0

### 2. Trending Movies

#### **GET /api/trending-movies**

Lấy danh sách phim xu hướng từ TheMovieDB.

**Request:**

```http
GET /api/trending-movies
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "title": "Tên Phim",
      "original_title": "Original Title",
      "overview": "Mô tả phim...",
      "poster_path": "/path/to/poster.jpg",
      "backdrop_path": "/path/to/backdrop.jpg",
      "release_date": "2024-01-01",
      "release_year": "2024",
      "vote_average": 8.5,
      "vote_count": 1000,
      "popularity": 95.5,
      "genre_ids": [28, 12, 16]
    }
  ],
  "message": "Trending movies retrieved successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Popular Movies

#### **GET /api/popular-movies**

Lấy danh sách phim phổ biến với phân trang.

**Request:**

```http
GET /api/popular-movies?page=1
```

**Parameters:**

- `page` (optional): Số trang (mặc định: 1)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "title": "Tên Phim",
      "original_title": "Original Title",
      "overview": "Mô tả phim...",
      "poster_path": "/path/to/poster.jpg",
      "backdrop_path": "/path/to/backdrop.jpg",
      "release_date": "2024-01-01",
      "release_year": "2024",
      "vote_average": 8.5,
      "vote_count": 1000,
      "popularity": 95.5,
      "genre_ids": [28, 12, 16]
    }
  ],
  "current_page": 1,
  "total_pages": 500,
  "total_results": 10000,
  "message": "Popular movies retrieved successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Search Movies

#### **GET /api/search-movies**

Tìm kiếm phim theo từ khóa.

**Request:**

```http
GET /api/search-movies?query=avengers
```

**Parameters:**

- `query` (required): Từ khóa tìm kiếm

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "title": "Avengers: Endgame",
      "original_title": "Avengers: Endgame",
      "overview": "Mô tả phim...",
      "poster_path": "/path/to/poster.jpg",
      "backdrop_path": "/path/to/backdrop.jpg",
      "release_date": "2019-04-26",
      "release_year": "2019",
      "vote_average": 8.4,
      "vote_count": 25000,
      "popularity": 98.5,
      "genre_ids": [28, 12, 16]
    }
  ],
  "message": "Search completed successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 5. Movie Details

#### **GET /api/movie/{movie_id}**

Lấy thông tin chi tiết của một phim cụ thể.

**Request:**

```http
GET /api/movie/12345
```

**Parameters:**

- `movie_id` (required): ID của phim

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 12345,
    "title": "Tên Phim",
    "original_title": "Original Title",
    "overview": "Mô tả chi tiết phim...",
    "poster_path": "/path/to/poster.jpg",
    "backdrop_path": "/path/to/backdrop.jpg",
    "release_date": "2024-01-01",
    "release_year": "2024",
    "runtime": 120,
    "vote_average": 8.5,
    "vote_count": 1000,
    "popularity": 95.5,
    "genres": [
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "credits": {
      "cast": [
        {
          "id": 123,
          "name": "Tên Diễn Viên",
          "character": "Tên Nhân Vật",
          "profile_path": "/path/to/profile.jpg"
        }
      ],
      "crew": [...]
    },
    "videos": {
      "results": [
        {
          "id": "abc123",
          "name": "Trailer",
          "key": "video_key",
          "site": "YouTube",
          "type": "Trailer"
        }
      ]
    }
  },
  "message": "Movie details retrieved successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Mô tả lỗi chi tiết",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/endpoint"
}
```

### Common Error Codes

- **400 Bad Request**: Request không hợp lệ
- **404 Not Found**: Endpoint hoặc resource không tồn tại
- **500 Internal Server Error**: Lỗi server
- **503 Service Unavailable**: TheMovieDB API không khả dụng

## Rate Limiting

Hiện tại không có rate limiting, nhưng có thể được thêm vào trong tương lai để bảo vệ server.

## Caching

- **Server Info**: Không cache (real-time data)
- **Movie Data**: Cache trong memory để tối ưu performance
- **Search Results**: Cache trong memory với TTL

## Examples

### JavaScript (Frontend)

```javascript
// Lấy thông tin server
async function getServerInfo() {
  try {
    const response = await fetch("/api/server-info");
    const data = await response.json();

    if (data.success) {
      console.log("Server Time:", data.data.serverTime);
      console.log("Memory Usage:", data.data.memoryUsage.heapUsed);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Tìm kiếm phim
async function searchMovies(query) {
  try {
    const response = await fetch(
      `/api/search-movies?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### cURL

```bash
# Lấy thông tin server
curl -X GET http://localhost:3000/api/server-info

# Tìm kiếm phim
curl -X GET "http://localhost:3000/api/search-movies?query=avengers"

# Lấy chi tiết phim
curl -X GET http://localhost:3000/api/movie/12345
```

### Python

```python
import requests

# Lấy thông tin server
response = requests.get('http://localhost:3000/api/server-info')
if response.status_code == 200:
    data = response.json()
    print(f"Server Time: {data['data']['serverTime']}")

# Tìm kiếm phim
search_response = requests.get('http://localhost:3000/api/search-movies',
                             params={'query': 'avengers'})
if search_response.status_code == 200:
    movies = search_response.json()['data']
    for movie in movies:
        print(f"Title: {movie['title']}")
```

## Testing

### Test Endpoints

```bash
# Test server info
npm test

# Test network monitoring
npm run monitor

# Test specific endpoint
node client.js
```

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

## Monitoring

### Performance Metrics

- Response time
- Request count
- Error rate
- Memory usage
- API call success rate

### Logs

- Request logs
- Error logs
- Performance logs
- TheMovieDB API logs

## Troubleshooting

### Common Issues

1. **Server không khởi động**

   - Kiểm tra port 3000 có bị chiếm không
   - Kiểm tra Node.js version
   - Kiểm tra dependencies

2. **API trả về lỗi 500**

   - Kiểm tra TheMovieDB API key
   - Kiểm tra network connection
   - Xem server logs

3. **Phim không hiển thị**
   - Kiểm tra TheMovieDB API response
   - Kiểm tra data format
   - Xem browser console errors

### Debug Mode

Để bật debug mode, thêm vào environment:

```bash
DEBUG=* npm start
```

## Kết Luận

API của Lmao Phim được thiết kế đơn giản và dễ sử dụng, cung cấp đầy đủ chức năng để xây dựng một website xem phim hoàn chỉnh. Tài liệu này cung cấp thông tin chi tiết để developers có thể tích hợp và sử dụng API một cách hiệu quả.
