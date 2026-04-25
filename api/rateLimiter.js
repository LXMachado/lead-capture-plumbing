import redis from 'redis';

// Rate limiter using Redis for distributed rate limiting
class RateLimiter {
  constructor(options = {}) {
    this.redisHost = options.host || process.env.REDIS_HOST || 'localhost';
    this.redisPort = options.port || process.env.REDIS_PORT || 6379;
    this.redisPassword = options.password || process.env.REDIS_PASSWORD || null;
    this.redisDb = options.db || process.env.REDIS_DB || 0;
    
    // Default rate limit settings
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
    this.maxRequests = options.maxRequests || 10; // 10 requests per window
    
    // Initialize Redis client but don't connect yet
    this.client = redis.createClient({
      host: this.redisHost,
      port: this.redisPort,
      password: this.redisPassword,
      database: this.redisDb
    });
    
    // Connection status
    this.isConnecting = false;
    this.isConnected = false;
    
    // Handle Redis connection events
    this.client.on('error', (err) => {
      // Only log if we're not in test environment to avoid test pollution
      if (process.env.NODE_ENV !== 'test') {
        console.error('Redis rate limiter error:', err);
      }
      this.isConnected = false;
    });
    
    this.client.on('connect', () => {
      this.isConnected = true;
      this.isConnecting = false;
      // Only log if we're not in test environment
      if (process.env.NODE_ENV !== 'test') {
        console.log('Redis rate limiter connected');
      }
    });
    
    this.client.on('ready', () => {
      this.isConnected = true;
      this.isConnecting = false;
    });
    
    this.client.on('end', () => {
      this.isConnected = false;
      this.isConnecting = false;
    });
    
    // Fallback in-memory store for when Redis is unavailable
    this._fallbackMap = new Map();
  }
  
  /**
   * Ensure Redis connection is established
   * @private
   */
  async _ensureConnection() {
    // Skip connection in test environment to avoid hanging
    if (process.env.NODE_ENV === 'test') {
      return false;
    }
    
    if (this.isConnected || this.isConnecting) {
      return this.isConnected;
    }
    
    this.isConnecting = true;
    try {
      await this.client.connect();
      this.isConnected = true;
      this.isConnecting = false;
      return true;
    } catch (error) {
      this.isConnected = false;
      this.isConnecting = false;
      if (process.env.NODE_ENV !== 'test') {
        console.error('Failed to connect to Redis for rate limiting:', error.message);
      }
      return false;
    }
  }
  
  /**
   * Check if a request is allowed based on IP address
   * @param {string} ip - The IP address to check
   * @returns {Promise<Object>} - Object with allowed boolean and remaining requests
   */
  async consume(ip) {
    try {
      // Try to use Redis if available and not in test environment
      if (process.env.NODE_ENV !== 'test' && await this._ensureConnection()) {
        return await this._consumeRedis(ip);
      }
      
      // Fallback to in-memory rate limiting
      return this._fallbackConsume(ip);
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fallback to allowing the request if rate limiter fails
      return { allowed: true, remaining: this.maxRequests, resetTime: new Date(), retryAfter: 0 };
    }
  }
  
  /**
   * Consume using Redis
   * @private
   */
  async _consumeRedis(ip) {
    const key = `rate_limit:${ip}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Remove outdated entries and count current requests
    await this.client.zRemRangeByScore(key, 0, windowStart);
    const currentCount = await this.client.zCard(key);
    
    if (currentCount >= this.maxRequests) {
      // Get the timestamp of the oldest request to calculate retry time
      const oldestTimestamp = await this.client.zRange(key, 0, 0);
      const retryAfter = Math.ceil((parseInt(oldestTimestamp[0]) - windowStart) / 1000);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + retryAfter * 1000),
        retryAfter: Math.max(0, retryAfter)
      };
    }
    
    // Add current request timestamp
    await this.client.zAdd(key, {
      score: now,
      value: `${now}-${Math.random()}` // Unique value to allow multiple requests at same ms
    });
    
    // Set expiration to automatically clean up old keys
    await this.client.expire(key, Math.ceil(this.windowMs / 1000));
    
    return {
      allowed: true,
      remaining: this.maxRequests - currentCount - 1,
      resetTime: new Date(now + this.windowMs),
      retryAfter: 0
    };
  }
  
  /**
   * Fallback in-memory rate limiter when Redis is unavailable or in test environment
   * @private
   */
  _fallbackConsume(ip) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const timestamps = this._fallbackMap.get(ip) || [];
    const recent = timestamps.filter(timestamp => now - timestamp < this.windowMs);
    
    if (recent.length >= this.maxRequests) {
      const oldestTimestamp = Math.min(...recent);
      const retryAfter = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + retryAfter * 1000),
        retryAfter: Math.max(0, retryAfter)
      };
    }
    
    recent.push(now);
    this._fallbackMap.set(ip, recent);
    
    return {
      allowed: true,
      remaining: this.maxRequests - recent.length,
      resetTime: new Date(now + this.windowMs),
      retryAfter: 0
    };
  }
  
  /**
   * Close Redis connection
   */
  async close() {
    if (this.isConnected && this.client.isOpen) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
  
  /**
   * Clear all rate limit data (useful for testing)
   */
  async clearAll() {
    if (process.env.NODE_ENV !== 'test' && this.isConnected && this.client.isOpen) {
      const keys = await this.client.keys('rate_limit:*');
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    }
    this._fallbackMap.clear();
  }
}

// Export a singleton instance
export const rateLimiter = new RateLimiter();