
// File: YoutubeVideoList.jsx

import React, { useState } from 'react';
import './YoutubeVideoList.css';

// Fake JSON data with YouTube video fields
const fakeVideoData = [
  {
    id: 1,
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    title: 'How to Learn React in 2025 - Complete Guide',
    channel: 'Tech Learning Hub',
    channelAvatar: 'https://i.pravatar.cc/150?img=1',
    views: '2.5M views',
    uploadedAt: '2 weeks ago',
    duration: '45:30',
    description: 'Learn React from scratch with this comprehensive tutorial covering hooks, context, and modern patterns.',
    subscribers: '542K',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 2,
    videoId: 'jWIUYstHN-w',
    thumbnail: 'https://img.youtube.com/vi/jWIUYstHN-w/maxresdefault.jpg',
    title: 'Full-Stack Web Development - MERN Stack Complete Course',
    channel: 'Code Masters',
    channelAvatar: 'https://i.pravatar.cc/150?img=2',
    views: '1.8M views',
    uploadedAt: '1 month ago',
    duration: '8:23:45',
    description: 'Complete MERN stack course covering MongoDB, Express, React, and Node.js with real-world projects.',
    subscribers: '891K',
    videoUrl: 'https://www.youtube.com/watch?v=jWIUYstHN-w'
  },
  {
    id: 3,
    videoId: 'x_EEwGe-a-Q',
    thumbnail: 'https://img.youtube.com/vi/x_EEwGe-a-Q/maxresdefault.jpg',
    title: 'Advanced JavaScript Concepts Explained',
    channel: 'JavaScript Mastery',
    channelAvatar: 'https://i.pravatar.cc/150?img=3',
    views: '3.2M views',
    uploadedAt: '3 weeks ago',
    duration: '2:15:30',
    description: 'Deep dive into closure, prototypes, async/await, and event loop with practical examples.',
    subscribers: '1.2M',
    videoUrl: 'https://www.youtube.com/watch?v=x_EEwGe-a-Q'
  },
  {
    id: 4,
    videoId: 'AC5P3XQx7uQ',
    thumbnail: 'https://img.youtube.com/vi/AC5P3XQx7uQ/maxresdefault.jpg',
    title: 'Web Development Career Path 2025',
    channel: 'Career Dev Channel',
    channelAvatar: 'https://i.pravatar.cc/150?img=4',
    views: '950K views',
    uploadedAt: '5 days ago',
    duration: '32:15',
    description: 'Your roadmap to becoming a professional web developer with all resources and tips.',
    subscribers: '324K',
    videoUrl: 'https://www.youtube.com/watch?v=AC5P3XQx7uQ'
  },
  {
    id: 5,
    videoId: '9sHEMj5_BqQ',
    thumbnail: 'https://img.youtube.com/vi/9sHEMj5_BqQ/maxresdefault.jpg',
    title: 'CSS Grid & Flexbox - Responsive Design Tutorial',
    channel: 'Web Design Pro',
    channelAvatar: 'https://i.pravatar.cc/150?img=5',
    views: '2.1M views',
    uploadedAt: '10 days ago',
    duration: '1:45:20',
    description: 'Master CSS Grid and Flexbox for creating responsive layouts without frameworks.',
    subscribers: '678K',
    videoUrl: 'https://www.youtube.com/watch?v=9sHEMj5_BqQ'
  },
  {
    id: 6,
    videoId: 'a1ijNWVl4eA',
    thumbnail: 'https://img.youtube.com/vi/a1ijNWVl4eA/maxresdefault.jpg',
    title: 'Node.js API Development - Best Practices',
    channel: 'Backend Masters',
    channelAvatar: 'https://i.pravatar.cc/150?img=6',
    views: '1.3M views',
    uploadedAt: '2 weeks ago',
    duration: '3:20:15',
    description: 'Build production-ready REST APIs with Node.js, Express, and best practices for scaling.',
    subscribers: '456K',
    videoUrl: 'https://www.youtube.com/watch?v=a1ijNWVl4eA'
  },
  {
    id: 7,
    videoId: 'HyWYphumrWE',
    thumbnail: 'https://img.youtube.com/vi/HyWYphumrWE/maxresdefault.jpg',
    title: 'Database Design - SQL vs NoSQL',
    channel: 'Database Experts',
    channelAvatar: 'https://i.pravatar.cc/150?img=7',
    views: '890K views',
    uploadedAt: '3 weeks ago',
    duration: '1:30:45',
    description: 'Understanding when to use SQL or NoSQL databases with practical use cases.',
    subscribers: '234K',
    videoUrl: 'https://www.youtube.com/watch?v=HyWYphumrWE'
  },
  {
    id: 8,
    videoId: 'e2b6BdEJ0fY',
    thumbnail: 'https://img.youtube.com/vi/e2b6BdEJ0fY/maxresdefault.jpg',
    title: 'Docker & Kubernetes for Beginners',
    channel: 'DevOps Academy',
    channelAvatar: 'https://i.pravatar.cc/150?img=8',
    views: '1.5M views',
    uploadedAt: '1 month ago',
    duration: '4:15:30',
    description: 'Complete guide to containerization and orchestration with Docker and Kubernetes.',
    subscribers: '567K',
    videoUrl: 'https://www.youtube.com/watch?v=e2b6BdEJ0fY'
  }
];

// Main Component
function YoutubeVideoList() {
  const [videos, setVideos] = useState(fakeVideoData);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  // Video Card Component
  const VideoCard = ({ video }) => (
    <div
      className="video-card"
      onMouseEnter={() => setHoveredVideo(video.id)}
      onMouseLeave={() => setHoveredVideo(null)}
    >
      {/* Thumbnail Container */}
      <div className="thumbnail-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="thumbnail"
          loading="lazy"
        />
        <div className="duration-badge">{video.duration}</div>

        {/* Hover overlay */}
        {hoveredVideo === video.id && (
          <div className="video-hover-overlay">
            <button className="play-button">▶</button>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="video-info">
        {/* Channel Avatar */}
        <img
          src={video.channelAvatar}
          alt={video.channel}
          className="channel-avatar"
        />

        {/* Video Details */}
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="channel-name">{video.channel}</p>
          <p className="video-meta">
            {video.views} • {video.uploadedAt}
          </p>
        </div>

        {/* Menu Icon */}
        <div className="video-menu">⋮</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="mobile-container">
        <div className="youtube-header-mobile">
          <h1 className="youtube-logo-mobile">▶ YouTube</h1>
          <input
            type="text"
            placeholder="Search"
            className="search-mobile"
          />
        </div>

        <div className="videos-grid-mobile">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="desktop-container">
        <div className="youtube-header-desktop">
          <div className="header-left">
            <button className="menu-button">☰</button>
            <h1 className="youtube-logo-desktop">▶ YouTube</h1>
          </div>

          <div className="header-center">
            <input
              type="text"
              placeholder="Search"
              className="search-desktop"
            />
            <button className="search-button">🔍</button>
          </div>

          <div className="header-right">
            <button className="icon-button">⬆</button>
            <button className="icon-button">🔔</button>
            <button className="user-button">👤</button>
          </div>
        </div>

        <div className="desktop-content">
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-item active">🏠 Home</div>
              <div className="sidebar-item">🎬 Shorts</div>
              <div className="sidebar-item">📺 Subscriptions</div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-label">You</div>
              <div className="sidebar-item">👤 Your Channel</div>
              <div className="sidebar-item">📋 History</div>
              <div className="sidebar-item">⏱ Watch Later</div>
            </div>
          </aside>

          <main className="videos-grid-desktop">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export default YoutubeVideoList;
