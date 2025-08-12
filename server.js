const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3000;

// TheMovieDB API Configuration
const TMDB_CONFIG = {
    API_KEY: process.env.API_KEY,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    IMAGE_SIZES: {
        poster: {
            small: 'w185',
            medium: 'w342',
            large: 'w500',
            original: 'original'
        },
        backdrop: {
            small: 'w300',
            medium: 'w780',
            large: 'w1280',
            original: 'original'
        }
    }
};

// API Endpoints
const API_ENDPOINTS = {
    TRENDING_MOVIES: '/trending/movie/week',
    POPULAR_MOVIES: '/movie/popular',
    TOP_RATED_MOVIES: '/movie/top_rated',
    UPCOMING_MOVIES: '/movie/upcoming',
    NOW_PLAYING_MOVIES: '/movie/now_playing',
    MOVIE_DETAILS: '/movie/{movie_id}',
    MOVIE_VIDEOS: '/movie/{movie_id}/videos',
    MOVIE_CREDITS: '/movie/{movie_id}/credits',
    MOVIE_SIMILAR: '/movie/{movie_id}/similar',
    MOVIE_RECOMMENDATIONS: '/movie/{movie_id}/recommendations',
    TRENDING_TV: '/trending/tv/week',
    POPULAR_TV: '/tv/popular',
    TOP_RATED_TV: '/tv/top_rated',
    TV_DETAILS: '/tv/{tv_id}',
    TV_VIDEOS: '/tv/{tv_id}/videos',
    TV_CREDITS: '/tv/{tv_id}/credits',
    TV_SIMILAR: '/tv/{tv_id}/similar',
    TV_RECOMMENDATIONS: '/tv/{tv_id}/recommendations',
    SEARCH_MULTI: '/search/multi',
    SEARCH_MOVIES: '/search/movie',
    SEARCH_TV: '/search/tv',
    MOVIE_GENRES: '/genre/movie/list',
    TV_GENRES: '/genre/tv/list'
};

// Helper functions
const API_HELPERS = {
    getImageUrl: (path, size = 'w500', type = 'poster') => {
        if (!path) return null;
        return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
    },
    getPosterUrl: (path, size = 'w500') => {
        return API_HELPERS.getImageUrl(path, size, 'poster');
    },
    getBackdropUrl: (path, size = 'w1280') => {
        return API_HELPERS.getImageUrl(path, size, 'backdrop');
    },
    formatDuration: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    },
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    getYear: (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).getFullYear();
    }
};

// Custom HTTP client function (built-in modules only)
function makeHTTPRequest(options) {
    return new Promise((resolve, reject) => {
        const protocol = options.protocol === 'https:' ? https : http;
        
        const requestOptions = {
            hostname: options.hostname,
            port: options.port || (options.protocol === 'https:' ? 443 : 80),
            path: options.path,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = protocol.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: parsedData
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Custom headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Server-Info', 'MovieDB-Express-Server');
    res.setHeader('X-Request-Time', new Date().toISOString());
    res.setHeader('X-API-Version', '1.0.0');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server info endpoint
app.get('/api/server-info', (req, res) => {
    const serverInfo = {
        timestamp: new Date().toISOString(),
        serverTime: new Date().toLocaleString('vi-VN'),
        uptime: process.uptime(),
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        pid: process.pid,
        environment: process.env.NODE_ENV || 'development'
    };
    
    res.json(serverInfo);
});

// Trending movies endpoint
app.get('/api/trending-movies', async (req, res) => {
    try {
        const url = new URL(`${TMDB_CONFIG.BASE_URL}${API_ENDPOINTS.TRENDING_MOVIES}`);
        url.searchParams.append('api_key', TMDB_CONFIG.API_KEY);
        url.searchParams.append('language', 'vi-VN');
        
        const response = await makeHTTPRequest({
            protocol: 'https:',
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${TMDB_CONFIG.ACCESS_TOKEN}`
            }
        });
        
        if (response.statusCode === 200) {
            // Process and format the data
            const movies = response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                overview: movie.overview,
                poster_path: API_HELPERS.getPosterUrl(movie.poster_path, 'w500'),
                backdrop_path: API_HELPERS.getBackdropUrl(movie.backdrop_path, 'w1280'),
                release_date: movie.release_date,
                release_year: API_HELPERS.getYear(movie.release_date),
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                genre_ids: movie.genre_ids
            }));
            
            res.json({
                success: true,
                data: movies,
                total_results: response.data.total_results,
                total_pages: response.data.total_pages
            });
        } else {
            res.status(response.statusCode).json({
                success: false,
                error: 'Failed to fetch trending movies',
                statusCode: response.statusCode
            });
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Popular movies endpoint
app.get('/api/popular-movies', async (req, res) => {
    try {
        const url = new URL(`${TMDB_CONFIG.BASE_URL}${API_ENDPOINTS.POPULAR_MOVIES}`);
        url.searchParams.append('api_key', TMDB_CONFIG.API_KEY);
        url.searchParams.append('language', 'vi-VN');
        url.searchParams.append('page', req.query.page || '1');
        
        const response = await makeHTTPRequest({
            protocol: 'https:',
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${TMDB_CONFIG.ACCESS_TOKEN}`
            }
        });
        
        if (response.statusCode === 200) {
            const movies = response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                overview: movie.overview,
                poster_path: API_HELPERS.getPosterUrl(movie.poster_path, 'w500'),
                backdrop_path: API_HELPERS.getBackdropUrl(movie.backdrop_path, 'w1280'),
                release_date: movie.release_date,
                release_year: API_HELPERS.getYear(movie.release_date),
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                genre_ids: movie.genre_ids
            }));
            
            res.json({
                success: true,
                data: movies,
                total_results: response.data.total_results,
                total_pages: response.data.total_pages,
                current_page: response.data.page
            });
        } else {
            res.status(response.statusCode).json({
                success: false,
                error: 'Failed to fetch popular movies',
                statusCode: response.statusCode
            });
        }
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Search movies endpoint
app.get('/api/search-movies', async (req, res) => {
    try {
        const { query, page = '1' } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        
        const url = new URL(`${TMDB_CONFIG.BASE_URL}${API_ENDPOINTS.SEARCH_MOVIES}`);
        url.searchParams.append('api_key', TMDB_CONFIG.API_KEY);
        url.searchParams.append('language', 'vi-VN');
        url.searchParams.append('query', query);
        url.searchParams.append('page', page);
        
        const response = await makeHTTPRequest({
            protocol: 'https:',
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${TMDB_CONFIG.ACCESS_TOKEN}`
            }
        });
        
        if (response.statusCode === 200) {
            const movies = response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                overview: movie.overview,
                poster_path: API_HELPERS.getPosterUrl(movie.poster_path, 'w500'),
                backdrop_path: API_HELPERS.getBackdropUrl(movie.backdrop_path, 'w1280'),
                release_date: movie.release_date,
                release_year: API_HELPERS.getYear(movie.release_date),
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                genre_ids: movie.genre_ids
            }));
            
            res.json({
                success: true,
                data: movies,
                total_results: response.data.total_results,
                total_pages: response.data.total_pages,
                current_page: response.data.page,
                query: query
            });
        } else {
            res.status(response.statusCode).json({
                success: false,
                error: 'Failed to search movies',
                statusCode: response.statusCode
            });
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Movie details endpoint
app.get('/api/movie/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const url = new URL(`${TMDB_CONFIG.BASE_URL}${API_ENDPOINTS.MOVIE_DETAILS.replace('{movie_id}', movieId)}`);
        url.searchParams.append('api_key', TMDB_CONFIG.API_KEY);
        url.searchParams.append('language', 'vi-VN');
        url.searchParams.append('append_to_response', 'credits,videos,similar,recommendations');
        
        const response = await makeHTTPRequest({
            protocol: 'https:',
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${TMDB_CONFIG.ACCESS_TOKEN}`
            }
        });
        
        if (response.statusCode === 200) {
            const movie = response.data;
            const formattedMovie = {
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                overview: movie.overview,
                poster_path: API_HELPERS.getPosterUrl(movie.poster_path, 'original'),
                backdrop_path: API_HELPERS.getBackdropUrl(movie.backdrop_path, 'original'),
                release_date: movie.release_date,
                release_year: API_HELPERS.getYear(movie.release_date),
                runtime: API_HELPERS.formatDuration(movie.runtime),
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                popularity: movie.popularity,
                genres: movie.genres,
                production_companies: movie.production_companies,
                budget: movie.budget,
                revenue: movie.revenue,
                status: movie.status,
                credits: movie.credits,
                videos: movie.videos,
                similar: movie.similar,
                recommendations: movie.recommendations
            };
            
            res.json({
                success: true,
                data: formattedMovie
            });
        } else {
            res.status(response.statusCode).json({
                success: false,
                error: 'Failed to fetch movie details',
                statusCode: response.statusCode
            });
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: '404 - Not Found',
        message: 'The requested resource was not found on this server',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: '500 - Internal Server Error',
        message: 'Something went wrong on the server',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên http://localhost:${PORT}`);
    console.log(`📅 Server start time: ${new Date().toLocaleString('vi-VN')}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
});
