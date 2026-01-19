# E-Project.Net - Complete CSS Styles Guide

Complete CSS stylesheet documentation for the Spotify-style music web application. This guide includes all styles needed to recreate the UI exactly as designed.

## Table of Contents
1. [CSS Variables & Base Styles](#css-variables--base-styles)
2. [Layout & Header](#layout--header)
3. [Authentication & Forms](#authentication--forms)
4. [Music Page & Songs Grid](#music-page--songs-grid)
5. [Music Player](#music-player)
6. [Playlists](#playlists)
7. [Home Page](#home-page)
8. [Profile Page](#profile-page)
9. [Admin Dashboard](#admin-dashboard)
10. [Song Management](#song-management)

---

## CSS Variables & Base Styles

```css
/* Root Variables */
:root {
  --spotify-green: #1DB954;
  --spotify-green-hover: #1ed760;
  --spotify-black: #000;
  --spotify-dark: #121212;
  --spotify-gray: #181818;
  --spotify-light-gray: #282828;
  --spotify-text: #fff;
  --spotify-text-muted: #b3b3b3;
  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  line-height: 1.6;
  font-weight: 400;

  color-scheme: dark;
  color: #fff;
  background-color: #000;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Global Reset & Focus Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none !important;
    -webkit-tap-highlight-color: transparent;
}

*:focus,
*:focus-visible,
*:active {
    outline: none !important;
    box-shadow: none !important;
}

button,
input,
textarea,
select,
a {
    outline: none !important;
}

button:focus,
button:focus-visible,
button:active,
input:focus,
input:focus-visible,
textarea:focus,
select:focus,
a:focus {
    outline: none !important;
    box-shadow: none !important;
}

/* Body & Typography */
body {
    font-family: 'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #000;
    min-height: 100vh;
    color: #fff;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
}
button:focus,
button:focus-visible {
  outline: none;
}
```

---

## Layout & Header

```css
/* Main Layout */
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #000;
}

/* Header / Navbar */
.main-header {
    background: #000;
    border-bottom: 1px solid #282828;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 12px 40px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 30px;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
}

.logo-icon {
    width: 36px;
    height: 36px;
    filter: invert(1);
}

.logo-text {
    color: #fff;
    font-weight: 700;
}

/* Header Layout */
.header-left {
    display: flex;
    align-items: center;
    gap: 40px;
}

.header-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
    position: relative;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

/* Navigation */
.main-nav {
    display: flex;
    gap: 5px;
}

.nav-link {
    color: #b3b3b3;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: color 0.2s ease;
    font-weight: 600;
    font-size: 14px;
}

.nav-link:hover {
    color: #fff;
}

.nav-link.active {
    color: #fff;
}

/* Search Bar */
.header-search {
    display: flex;
    align-items: center;
    background: #242424;
    border-radius: 500px;
    padding: 0;
    width: 100%;
    max-width: 400px;
    border: 1px solid transparent;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
}

.header-search:focus-within {
    background: #333;
    border-color: #fff;
}

.header-search input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 10px 16px;
    color: #fff;
    font-size: 14px;
    outline: none;
}

.header-search input::placeholder {
    color: #a7a7a7;
}

.header-search .search-btn {
    background: transparent;
    border: none;
    padding: 10px 12px 10px 16px;
    cursor: pointer;
    color: #a7a7a7;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.header-search .search-btn:hover {
    color: #fff;
}

.header-search .clear-btn {
    background: transparent;
    border: none;
    padding: 10px 16px 10px 0;
    cursor: pointer;
    color: #a7a7a7;
    font-size: 18px;
    line-height: 1;
    transition: color 0.2s;
    display: flex;
    align-items: center;
}

.header-search .clear-btn:hover {
    color: #fff;
}

/* Search Suggestions Dropdown */
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #212121;
    border-radius: 8px;
    margin-top: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #333;
}

.suggestion-loading {
    padding: 16px;
    text-align: center;
    color: #b3b3b3;
    font-size: 14px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
}

.suggestion-item:hover {
    background: #333;
}

.suggestion-item:first-child {
    border-radius: 8px 8px 0 0;
}

.suggestion-item:last-child {
    border-radius: 0 0 8px 8px;
}

.suggestion-icon {
    color: #b3b3b3;
    flex-shrink: 0;
}

.suggestion-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.suggestion-main {
    color: #fff;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.suggestion-main strong {
    color: #1DB954;
    font-weight: 700;
}

.suggestion-sub {
    color: #b3b3b3;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Notification Bell */
.notification-container {
    position: relative;
}

.notification-btn {
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #b3b3b3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    position: relative;
}

.notification-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}

.notification-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #e74c3c;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
}

.notification-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 360px;
    max-height: 480px;
    background: #282828;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    margin-top: 8px;
    z-index: 1001;
    overflow: hidden;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #333;
}

.notification-header h3 {
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}

.mark-all-read {
    background: transparent;
    border: none;
    color: #1DB954;
    font-size: 12px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s;
}

.mark-all-read:hover {
    background: rgba(29, 185, 84, 0.1);
}

.notification-list {
    max-height: 400px;
    overflow-y: auto;
}

.notification-empty {
    padding: 40px 20px;
    text-align: center;
}

.notification-empty svg {
    opacity: 0.5;
    margin-bottom: 12px;
}

.notification-empty p {
    color: #b3b3b3;
    margin: 0;
    font-size: 14px;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
}

.notification-item:hover {
    background: #333;
}

.notification-item.unread {
    background: rgba(29, 185, 84, 0.05);
}

.notification-item.unread:hover {
    background: rgba(29, 185, 84, 0.1);
}

.notification-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #181818;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.notification-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-message {
    color: #fff;
    font-size: 14px;
    margin: 0 0 4px 0;
    line-height: 1.4;
}

.notification-time {
    color: #b3b3b3;
    font-size: 12px;
}

.unread-dot {
    width: 8px;
    height: 8px;
    background: #1DB954;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px;
}

/* User Menu */
.user-menu {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
}

.user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e94560, #ff6b6b);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    border: 2px solid #282828;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-avatar span {
    color: white;
    font-weight: 700;
    font-size: 1.2rem;
}

.user-dropdown {
    position: relative;
}

.user-name {
    color: #fff;
    font-weight: 600;
    cursor: pointer;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    background: rgba(20, 20, 30, 0.98);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(233, 69, 96, 0.3);
    border-radius: 10px;
    min-width: 200px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.user-dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    display: block;
    padding: 12px 20px;
    color: #b3b3b3;
    text-decoration: none;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 0.95rem;
}

.dropdown-item:hover {
    border-left: 2px solid #1DB954;
    color: #fff;
}

.logout-btn {
    border-top: 1px solid rgba(233, 69, 96, 0.3);
}

/* Auth Buttons */
.auth-buttons {
    display: flex;
    gap: 10px;
}

.btn-header {
    padding: 8px 20px;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.btn-login {
    color: #b3b3b3;
    border-color: #b3b3b3;
}

.btn-login:hover {
    border-color: #fff;
}

.btn-register {
    background: #1DB954;
    color: #000;
    font-weight: 700;
}

/* Main Content */
.main-content {
    flex: 1;
    padding-bottom: 120px;
}

.page-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 40px 60px;
}

.page-header {
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 10px;
}

.page-header p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
}

/* Footer */
.main-footer {
    background: #121212;
    border-top: 1px solid #282828;
    color: #b3b3b3;
    margin-top: auto;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 30px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
}

.footer-section h3 {
    color: #fff;
    margin-bottom: 15px;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer-logo-icon {
    width: 24px;
    height: 24px;
    filter: invert(1);
}

.footer-section h4 {
    color: #fff;
    margin-bottom: 15px;
    font-size: 1rem;
}

.footer-section p {
    color: #b3b3b3;
    line-height: 1.6;
}

.footer-section a,
.footer-section button {
    display: block;
    color: #b3b3b3;
    text-decoration: none;
    padding: 5px 0;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.95rem;
}

.social-links {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.social-links a {
    font-size: 1.5rem;
    padding: 0;
}

.footer-bottom {
    text-align: center;
    padding: 20px;
    border-top: 1px solid #282828;
}

.footer-bottom p {
    color: #7a7a7a;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        gap: 15px;
    }

    .header-left {
        flex-direction: column;
        gap: 15px;
    }

    .main-nav {
        flex-wrap: wrap;
        justify-content: center;
    }

    .footer-container {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .social-links {
        justify-content: center;
    }

    .footer-section a,
    .footer-section button {
        text-align: center;
    }
}

@media (max-width: 480px) {
    .logo {
        font-size: 1.2rem;
    }

    .main-nav {
        gap: 10px;
    }

    .nav-link {
        padding: 6px 12px;
        font-size: 0.9rem;
    }
}
```

---

## Authentication & Forms

```css
/* Auth Container */
.auth-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* Auth Card */
.auth-card {
    background: #121212;
    border-radius: 8px;
    padding: 40px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    border: 1px solid #282828;
}

.auth-card h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.auth-logo {
    width: 32px;
    height: 32px;
    filter: invert(1);
}

/* Form Group */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #727272;
    border-radius: 4px;
    background: #121212;
    color: #fff;
    font-size: 14px;
    transition: all 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #fff;
    background: #121212;
}

.form-group input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-danger {
    display: inline-block;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    text-align: center;
}

.btn-primary {
    background: #1DB954;
    color: #000;
    width: 100%;
    font-weight: 700;
}

.btn-primary:hover {
    background: #1ed760;
    transform: scale(1.04);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border: 2px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(233, 69, 96, 0.5);
    box-shadow: 0 8px 25px rgba(233, 69, 96, 0.2);
    transform: translateY(-2px);
}

.btn-danger {
    background: #e74c3c;
    color: #fff;
}

.btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 71, 87, 0.4);
}

/* Messages */
.error-message {
    background: linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 71, 87, 0.1));
    border: 2px solid rgba(255, 71, 87, 0.5);
    color: #ff6b81;
    padding: 16px 20px;
    border-radius: 14px;
    margin-bottom: 24px;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 20px rgba(255, 71, 87, 0.2);
    font-weight: 500;
}

.success-message {
    background: linear-gradient(135deg, rgba(46, 213, 115, 0.2), rgba(46, 213, 115, 0.1));
    border: 2px solid rgba(46, 213, 115, 0.5);
    color: #7bed9f;
    padding: 16px 20px;
    border-radius: 14px;
    margin-bottom: 24px;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 20px rgba(46, 213, 115, 0.2);
    font-weight: 500;
}

/* Auth Links */
.auth-link {
    text-align: center;
    margin-top: 25px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
}

.auth-link a {
    color: #e94560;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
}

.auth-link a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #e94560, #ff6b6b);
    transition: width 0.3s ease;
}

.auth-link a:hover::after {
    width: 100%;
}

.auth-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
    margin-bottom: 10px;
}

.forgot-password-link {
    color: #ffa502;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.forgot-password-link:hover {
    color: #ff6348;
    text-decoration: underline;
}

.auth-description {
    text-align: center;
    color: #a0a0a0;
    margin-bottom: 20px;
    font-size: 0.95rem;
}

.token-display {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
    font-size: 1rem;
}

.token-display strong {
    color: #ffd700;
    font-size: 1.3rem;
    letter-spacing: 2px;
}

.token-note {
    font-size: 0.85rem;
    color: #7bed9f;
    margin-top: 10px;
}
```

---

## Music Page & Songs Grid

```css
/* Music Page */
.music-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 60px;
}

.music-header {
    text-align: center;
    margin-bottom: 50px;
}

.music-header h1 {
    font-size: 3.5rem;
    color: #fff;
    margin-bottom: 12px;
    font-weight: 900;
    letter-spacing: -1px;
}

.music-header p {
    color: #b3b3b3;
    font-size: 1.1rem;
    margin-bottom: 10px;
}

.music-header .search-result-info {
    color: #1DB954;
    font-size: 1rem;
    margin-top: 15px;
    padding: 10px 20px;
    background: rgba(29, 185, 84, 0.1);
    border-radius: 20px;
    display: inline-block;
}

/* Search Bar */
.search-section {
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
}

.search-bar {
    display: flex;
    gap: 15px;
    max-width: 600px;
    width: 100%;
}

.search-bar input {
    flex: 1;
    padding: 14px 20px;
    background: #121212;
    border: 1px solid #727272;
    border-radius: 500px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    outline: none;
    border-color: #fff;
}

.search-bar button {
    padding: 14px 30px;
    background: #1DB954;
    border: none;
    border-radius: 500px;
    color: #000;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-bar button:hover {
    background: #1ed760;
}

/* Songs Grid */
.songs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

/* Song Card */
.song-card {
    background: #181818;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.song-card:hover {
    background: #282828;
}

.song-card-image {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    margin-bottom: 16px;
    border-radius: 4px;
    overflow: hidden;
}

.song-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #282828 0%, #181818 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.song-logo-icon {
    width: 60%;
    height: 60%;
    filter: invert(1);
    opacity: 0.3;
}

.play-button-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.song-card:hover .play-button-overlay {
    opacity: 1;
}

.play-button {
    width: 56px;
    height: 56px;
    background: #1DB954;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
}

.play-button:hover {
    transform: scale(1.06);
    background: #1ed760;
}

/* Song Card Info */
.song-card-info {
    position: relative;
}

.song-card-info h3 {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 4px 0;
    padding-right: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.song-card-info p {
    color: #b3b3b3;
    font-size: 0.875rem;
    margin: 0;
    padding-right: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

/* Song Card Actions */
.song-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    position: absolute;
    top: 2px;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s;
}

.song-card:hover .song-card-actions {
    opacity: 1;
}

.btn-like {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #b3b3b3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 50%;
}

.btn-like:hover {
    transform: scale(1.1);
}

.btn-like.liked {
    color: #e74c3c;
}

.btn-add-playlist-mini {
    background: rgba(24, 24, 24, 0.8);
    border: 1px solid #282828;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b3b3b3;
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s;
}

.btn-add-playlist-mini:hover {
    background: #1DB954;
    color: #000;
    border-color: #1DB954;
}

/* Liked Songs Page */
.liked-songs-page .liked-header {
    display: flex;
    align-items: center;
    gap: 24px;
    text-align: left;
    padding: 40px 0;
    background: linear-gradient(180deg, #513496 0%, #121212 100%);
    margin: -40px -60px 40px -60px;
    padding: 60px;
}

.liked-header-icon {
    flex-shrink: 0;
}

.liked-header-text {
    flex: 1;
}

.liked-label {
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.liked-header-text h1 {
    font-size: 4rem;
    margin: 8px 0;
}

.liked-header-text p {
    color: #b3b3b3;
    margin: 0;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-state svg {
    margin-bottom: 24px;
    opacity: 0.5;
}

.empty-state h3 {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 12px;
}

.empty-state p {
    color: #b3b3b3;
    margin-bottom: 24px;
}

.empty-state .btn-primary {
    padding: 14px 32px;
    background: #1DB954;
    color: #000;
    border: none;
    border-radius: 500px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.empty-state .btn-primary:hover {
    background: #1ed760;
    transform: scale(1.04);
}

/* Playing Indicator */
.playing-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 3px;
    align-items: flex-end;
    height: 20px;
}

.wave {
    width: 3px;
    background: #e94560;
    animation: wave 0.8s ease-in-out infinite;
}

.wave:nth-child(1) {
    animation-delay: 0s;
}

.wave:nth-child(2) {
    animation-delay: 0.2s;
}

.wave:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes wave {
    0%, 100% {
        height: 5px;
    }
    50% {
        height: 20px;
    }
}

@media (max-width: 1024px) {
    .music-page {
        padding: 30px 40px;
    }

    .music-header h1 {
        font-size: 2.8rem;
    }

    .songs-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .music-page {
        padding: 20px 30px;
    }

    .music-header h1 {
        font-size: 2.2rem;
    }

    .search-bar {
        max-width: 100%;
    }

    .songs-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
    }
}

@media (max-width: 480px) {
    .music-page {
        padding: 15px 20px;
    }

    .music-header h1 {
        font-size: 1.8rem;
    }

    .music-header p {
        font-size: 0.95rem;
    }

    .search-bar {
        flex-direction: column;
    }

    .songs-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .song-card {
        padding: 12px;
    }
}
```

---

## Music Player

```css
/* Music Player (Fixed Bottom Bar) */
.music-player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #181818;
    border-top: 1px solid #282828;
    padding: 12px 16px;
    z-index: 1000;
    height: 90px;
}

.player-content {
    max-width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 16px;
    align-items: center;
}

/* Left Section - Song Info */
.player-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;
}

.player-album-art {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #282828 0%, #181818 100%);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.player-logo-icon {
    width: 32px;
    height: 32px;
    filter: invert(1);
    opacity: 0.5;
}

.player-details {
    min-width: 0;
    flex: 1;
}

.player-details h3 {
    font-size: 14px;
    margin: 0 0 4px 0;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.player-details p {
    color: #b3b3b3;
    font-size: 12px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Player Actions - Like & Add to Playlist */
.player-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
}

.player-action-btn {
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #b3b3b3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
}

.player-action-btn:hover {
    color: #fff;
    transform: scale(1.1);
}

.player-action-btn.liked {
    color: #e74c3c;
}

.playlist-dropdown-container {
    position: relative;
}

.player-playlist-dropdown {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #282828;
    border-radius: 8px;
    min-width: 200px;
    max-height: 250px;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    margin-bottom: 8px;
    z-index: 1001;
}

.player-playlist-dropdown .dropdown-header {
    padding: 12px 16px;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    border-bottom: 1px solid #333;
}

.player-playlist-dropdown .dropdown-message {
    padding: 8px 16px;
    color: #1DB954;
    font-size: 12px;
    text-align: center;
    background: rgba(29, 185, 84, 0.1);
}

.player-playlist-dropdown .dropdown-empty {
    padding: 16px;
    color: #b3b3b3;
    font-size: 13px;
    text-align: center;
}

.player-playlist-dropdown .dropdown-item {
    padding: 12px 16px;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
}

.player-playlist-dropdown .dropdown-item:hover {
    background: #333;
}

.player-playlist-dropdown .dropdown-item:last-child {
    border-radius: 0 0 8px 8px;
}

/* Center Section - Controls & Progress */
.player-center {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 722px;
    margin: 0 auto;
}

/* Player Controls */
.player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

.control-btn {
    background: transparent;
    border: none;
    color: #b3b3b3;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    font-size: 16px;
}

.control-btn:hover:not(:disabled) {
    color: #fff;
    transform: scale(1.06);
}

.control-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.play-btn {
    width: 32px;
    height: 32px;
    background: #fff;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    padding-left: 2px;
}

.play-btn:hover {
    background: #f0f0f0;
}

/* Progress Bar */
.player-progress {
    display: flex;
    align-items: center;
    gap: 8px;
}

.progress-bar {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: #4d4d4d;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}

.progress-bar:hover::-webkit-slider-thumb {
    opacity: 1;
}

.progress-bar::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    opacity: 0;
    transition: opacity 0.2s;
}

.progress-bar:hover::-moz-range-thumb {
    opacity: 1;
}

.time {
    font-size: 11px;
    color: #b3b3b3;
    min-width: 40px;
    text-align: center;
}

/* Right Section - Volume & Demo */
.player-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    min-width: 180px;
}

/* Volume Control */
.player-volume {
    display: flex;
    align-items: center;
    gap: 8px;
}

.player-volume span:first-child {
    font-size: 14px;
    color: #b3b3b3;
}

.volume-bar {
    width: 93px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: #4d4d4d;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.volume-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}

.volume-bar:hover::-webkit-slider-thumb {
    opacity: 1;
}

.volume-bar::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    opacity: 0;
    transition: opacity 0.2s;
}

.volume-bar:hover::-moz-range-thumb {
    opacity: 1;
}

.volume-percent {
    font-size: 11px;
    color: #b3b3b3;
    min-width: 32px;
}

/* Demo Badge */
.demo-badge {
    background: rgba(138, 43, 226, 0.2);
    color: #9d4edd;
    padding: 4px 12px;
    border-radius: 500px;
    font-size: 10px;
    font-weight: 600;
    border: 1px solid #9d4edd;
    white-space: nowrap;
}

@media (max-width: 1024px) {
    .player-content {
        grid-template-columns: 1fr 1.5fr 1fr;
    }
}

@media (max-width: 768px) {
    .music-player {
        height: auto;
        padding: 12px;
    }

    .player-content {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .player-left,
    .player-right {
        justify-content: center;
    }

    .player-center {
        order: -1;
    }

    .demo-badge {
        font-size: 9px;
        padding: 3px 8px;
    }
}
```

---

## Playlists

```css
.playlist-manager {
    padding: 40px 60px;
    max-width: 1400px;
    margin: 0 auto;
}

/* Centered Header */
.playlist-header-centered {
    text-align: center;
    margin-bottom: 50px;
}

.playlist-header-centered h1 {
    font-size: 3.5rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 12px;
    letter-spacing: -1px;
}

.playlist-header-centered p {
    color: #b3b3b3;
    font-size: 1.1rem;
    margin-bottom: 30px;
}

.header-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn-create-playlist {
    background: #1DB954;
    color: #000;
    padding: 12px 32px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-create-playlist:hover {
    background: #1ed760;
    transform: scale(1.04);
}

/* Alert Messages */
.alert {
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
}

.alert-success {
    background: rgba(29, 185, 84, 0.2);
    color: #1ed760;
    border: 1px solid #1ed760;
}

.alert-error {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    border: 1px solid #ff4757;
}

/* Playlists Grid */
.playlists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.playlist-card {
    background: #181818;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
    position: relative;
}

.playlist-card:hover {
    background: #282828;
}

/* Playlist Album Art */
.playlist-card-image {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    margin-bottom: 16px;
    border-radius: 4px;
    overflow: hidden;
    background: linear-gradient(135deg, #282828 0%, #181818 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.playlist-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
    filter: invert(1);
    opacity: 0.3;
}

.playlist-card-header {
    margin-bottom: 8px;
}

.playlist-card h3 {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.song-count {
    color: #b3b3b3;
    font-size: 0.875rem;
    margin: 0 0 8px 0;
    display: block;
}

.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.badge-public {
    background: rgba(29, 185, 84, 0.2);
    color: #1ed760;
    border: 1px solid #1ed760;
}

.badge-private {
    background: rgba(179, 179, 179, 0.2);
    color: #b3b3b3;
    border: 1px solid #b3b3b3;
}

.playlist-card-actions {
    display: flex;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #282828;
}

.btn-icon {
    background: transparent;
    border: 1px solid #282828;
    font-size: 16px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
    color: #b3b3b3;
}

.btn-icon:hover {
    background: #282828;
    color: #fff;
    border-color: #fff;
}

.btn-delete:hover {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    border-color: #ff4757;
}

/* Loading & Empty States */
.loading-text,
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #b3b3b3;
    font-size: 1.1rem;
    grid-column: 1 / -1;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 8px;
    padding: 30px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #282828;
}

.modal-header h2 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
}

.btn-close {
    background: transparent;
    border: none;
    color: #b3b3b3;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
}

.btn-close:hover {
    color: #fff;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: #fff;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-group input[type="text"],
.form-group textarea {
    width: 100%;
    padding: 12px 15px;
    background: #121212;
    border: 1px solid #727272;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #fff;
}

.form-group textarea {
    min-height: 100px;
    resize: vertical;
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.checkbox-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.checkbox-group label {
    color: #b3b3b3;
    font-weight: 400;
    margin: 0;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #282828;
}

/* Song List in Modal */
.available-songs {
    margin-top: 25px;
}

.available-songs h4 {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 15px;
}

.song-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: #121212;
    border: 1px solid #282828;
    border-radius: 4px;
    margin-bottom: 8px;
    transition: background 0.2s;
}

.song-item:hover {
    background: #282828;
}

.song-info h4 {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
}

.song-info p {
    color: #b3b3b3;
    font-size: 12px;
    margin: 0;
}

.btn-add,
.btn-remove {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-add {
    background: #1DB954;
    color: #000;
}

.btn-add:hover {
    background: #1ed760;
}

.btn-remove {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    border: 1px solid #ff4757;
}

.btn-remove:hover {
    background: rgba(255, 71, 87, 0.3);
}

/* Playlist Detail View */
.playlist-detail {
    background: #121212;
}

.playlist-detail-header {
    margin-bottom: 30px;
}

.btn-back {
    background: transparent;
    border: none;
    color: #b3b3b3;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 0;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s;
}

.btn-back:hover {
    color: #fff;
}

.playlist-detail-info {
    display: flex;
    gap: 30px;
    align-items: flex-end;
    padding: 30px;
    background: linear-gradient(135deg, #1f3f5f 0%, #152535 50%, #121212 100%);
    border-radius: 12px;
}

.playlist-detail-cover {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #282828 0%, #181818 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
}

.playlist-icon-large {
    width: 60%;
    height: 60%;
    filter: invert(1);
    opacity: 0.4;
}

.playlist-detail-meta {
    flex: 1;
}

.playlist-detail-meta h1 {
    font-size: 3rem;
    font-weight: 900;
    color: #fff;
    margin: 10px 0 15px;
    line-height: 1.1;
}

.playlist-description {
    color: #b3b3b3;
    font-size: 14px;
    margin-bottom: 10px;
}

.playlist-stats {
    color: #b3b3b3;
    font-size: 14px;
    margin-bottom: 20px;
}

.playlist-detail-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.playlist-detail-actions .btn-primary,
.playlist-detail-actions .btn-secondary,
.playlist-detail-actions .btn-danger {
    padding: 12px 24px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.playlist-detail-actions .btn-primary {
    background: #1DB954;
    color: #000;
}

.playlist-detail-actions .btn-primary:hover {
    background: #1ed760;
    transform: scale(1.04);
}

.playlist-detail-actions .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.playlist-detail-actions .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #fff;
}

.playlist-detail-actions .btn-danger {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    border: 1px solid #ff4757;
}

.playlist-detail-actions .btn-danger:hover {
    background: rgba(255, 71, 87, 0.3);
}

/* Songs List */
.playlist-songs {
    background: #181818;
    border-radius: 8px;
    overflow: hidden;
}

.songs-header {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 100px 50px;
    padding: 12px 20px;
    border-bottom: 1px solid #282828;
    color: #b3b3b3;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.song-row {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 100px 50px;
    padding: 12px 20px;
    align-items: center;
    border-bottom: 1px solid #282828;
    transition: background 0.2s;
}

.song-row:hover {
    background: #282828;
}

.song-row:last-child {
    border-bottom: none;
}

.col-index {
    color: #b3b3b3;
    font-size: 14px;
}

.col-title {
    color: #fff;
    font-weight: 500;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 15px;
}

.col-artist {
    color: #b3b3b3;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 15px;
}

.col-duration {
    color: #b3b3b3;
    font-size: 14px;
    text-align: center;
}

.col-action {
    display: flex;
    justify-content: center;
}

.btn-remove-song {
    background: transparent;
    border: none;
    color: #b3b3b3;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s;
    opacity: 0;
}

.song-row:hover .btn-remove-song {
    opacity: 1;
}

.btn-remove-song:hover {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
}

.empty-songs {
    padding: 60px 20px;
    text-align: center;
    color: #b3b3b3;
}

.empty-songs p {
    margin-bottom: 20px;
    font-size: 16px;
}

.empty-songs .btn-primary {
    background: #1DB954;
    color: #000;
    padding: 12px 24px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
}

.empty-songs .btn-primary:hover {
    background: #1ed760;
}

@media (max-width: 1024px) {
    .playlist-manager {
        padding: 30px 40px;
    }
    
    .playlists-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
    
    .playlist-header-centered h1 {
        font-size: 2.8rem;
    }

    .playlist-detail-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .playlist-detail-meta h1 {
        font-size: 2.2rem;
    }

    .playlist-detail-actions {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .playlist-manager {
        padding: 20px 30px;
    }
    
    .playlists-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
    }
    
    .playlist-header-centered h1 {
        font-size: 2.2rem;
    }

    .playlist-header-centered p {
        font-size: 1rem;
    }
    
    .playlist-card {
        padding: 16px;
    }

    .playlist-detail-cover {
        width: 150px;
        height: 150px;
    }

    .songs-header,
    .song-row {
        grid-template-columns: 40px 1fr 100px 40px;
    }

    .songs-header .col-artist,
    .song-row .col-artist {
        display: none;
    }
}

@media (max-width: 480px) {
    .playlist-manager {
        padding: 15px 20px;
    }
    
    .playlists-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .playlist-header-centered h1 {
        font-size: 1.8rem;
    }
    
    .playlist-header-centered p {
        font-size: 0.95rem;
    }

    .header-actions {
        flex-direction: column;
    }

    .btn-create-playlist {
        width: 100%;
    }
    
    .modal-content {
        padding: 20px;
        width: 95%;
    }

    .playlist-detail-meta h1 {
        font-size: 1.6rem;
    }

    .playlist-detail-actions {
        flex-direction: column;
    }

    .playlist-detail-actions button {
        width: 100%;
    }

    .songs-header,
    .song-row {
        grid-template-columns: 30px 1fr 40px;
    }

    .songs-header .col-duration,
    .song-row .col-duration {
        display: none;
    }
}
```

---

## Home Page

```css
/* Hero Banner */
.hero-banner {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: linear-gradient(180deg, #1f1f1f 0%, #121212 100%);
    position: relative;
    overflow: hidden;
    width: 100%;
}

.hero-wrapper {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 80px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 80px;
}

.hero-content {
    flex: 0 0 55%;
    max-width: 650px;
    z-index: 1;
}

.hero-title {
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 30px;
    color: #fff;
    letter-spacing: -2px;
}

.hero-title .highlight {
    color: #1DB954;
}

.hero-subtitle {
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 50px;
    line-height: 1.7;
    font-weight: 400;
}

.hero-actions {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.btn-hero {
    padding: 16px 40px;
    border-radius: 35px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
    letter-spacing: 0.5px;
}

.btn-primary-hero {
    background: linear-gradient(135deg, #e94560, #ff6b6b);
    color: #fff;
    box-shadow: 0 8px 25px rgba(233, 69, 96, 0.35);
    position: relative;
    overflow: hidden;
}

.btn-primary-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.btn-primary-hero:hover::before {
    left: 100%;
}

.btn-primary-hero:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(233, 69, 96, 0.5);
}

.btn-secondary-hero {
    background: transparent;
    color: #fff;
    border: 1px solid #727272;
}

.btn-secondary-hero:hover {
    border-color: #fff;
}

/* Hero Illustration */
.hero-illustration {
    flex: 0 0 45%;
    position: relative;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-logo-icon {
    width: 280px;
    height: 280px;
    filter: invert(1);
    opacity: 0.15;
}

/* Welcome Section */
.welcome-section {
    padding: 60px 30px;
    background: rgba(255, 255, 255, 0.02);
}

.welcome-container {
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-container h2 {
    text-align: center;
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 50px;
}

.user-name {
    color: #e94560;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.quick-action-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    padding: 45px 35px;
    text-align: center;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.quick-action-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(120, 40, 200, 0.1));
    opacity: 0;
    transition: opacity 0.4s ease;
}

.quick-action-card:hover::before {
    opacity: 1;
}

.quick-action-card:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: rgba(233, 69, 96, 0.5);
    box-shadow: 
        0 20px 50px rgba(233, 69, 96, 0.25),
        0 0 0 1px rgba(233, 69, 96, 0.3) inset;
}

.action-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 20px;
    color: #1DB954;
    transition: all 0.3s ease;
}

img.action-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 20px;
    filter: invert(1);
}

.quick-action-card:hover .action-icon {
    transform: scale(1.1);
}

.quick-action-card h3 {
    color: #fff;
    margin-bottom: 10px;
    font-size: 1.5rem;
}

.quick-action-card p {
    color: #b3b3b3;
    font-size: 0.95rem;
}

/* Features Section */
.features-section {
    padding: 80px 30px;
}

.features-container {
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 60px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.feature-card {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 8px;
    padding: 40px 24px;
    text-align: center;
    transition: background 0.3s ease;
}

.feature-card:hover {
    background: #282828;
}

.feature-icon {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #1DB954;
}

img.feature-icon {
    width: 48px;
    height: 48px;
    filter: invert(1);
}

.feature-card h3 {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 12px;
}

.feature-card p {
    color: #b3b3b3;
    line-height: 1.6;
}

/* CTA Section */
.cta-section {
    padding: 100px 40px;
    background: linear-gradient(135deg, rgba(233, 69, 96, 0.15) 0%, rgba(15, 12, 41, 0.4) 100%);
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta-section::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(233, 69, 96, 0.15), transparent 70%);
    filter: blur(80px);
    pointer-events: none;
}

.cta-container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.cta-container h2 {
    font-size: 3.5rem;
    background: linear-gradient(135deg, #fff, #e94560);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 25px;
    font-weight: 800;
    letter-spacing: -1.5px;
}

.cta-container p {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 50px;
    line-height: 1.7;
    font-weight: 300;
}

.cta-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.btn-cta {
    padding: 18px 40px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary-cta {
    background: linear-gradient(135deg, #e94560, #ff6b6b);
    color: #fff;
    box-shadow: 0 5px 25px rgba(233, 69, 96, 0.5);
}

.btn-primary-cta:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(233, 69, 96, 0.7);
}

@media (max-width: 1200px) {
    .hero-wrapper {
        padding: 60px 40px;
        gap: 50px;
    }

    .hero-title {
        font-size: 4rem;
    }
}

@media (max-width: 1024px) {
    .hero-banner {
        min-height: auto;
    }

    .hero-wrapper {
        flex-direction: column;
        text-align: center;
        padding: 60px 30px;
        gap: 60px;
    }

    .hero-content {
        flex: none;
        max-width: 100%;
    }

    .hero-actions {
        justify-content: center;
    }

    .hero-illustration {
        flex: none;
        width: 100%;
        min-height: 400px;
    }
}

@media (max-width: 768px) {
    .hero-wrapper {
        padding: 50px 25px;
    }

    .hero-title {
        font-size: 3rem;
        letter-spacing: -1px;
    }

    .hero-subtitle {
        font-size: 1.15rem;
        margin-bottom: 35px;
    }

    .section-title {
        font-size: 2rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .cta-container h2 {
        font-size: 2.5rem;
    }
}

@media (max-width: 480px) {
    .hero-banner {
        min-height: auto;
    }

    .hero-wrapper {
        padding: 40px 20px;
    }

    .hero-title {
        font-size: 2.2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .btn-hero {
        padding: 14px 28px;
        font-size: 1rem;
    }

    .quick-actions {
        grid-template-columns: 1fr;
    }

    .hero-illustration {
        min-height: 300px;
    }
}
```

---

## Profile Page

```css
/* Profile Page */
.profile-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 40px;
}

/* Messages */
.success-message {
    background: rgba(29, 185, 84, 0.2);
    color: #1ed760;
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid #1ed760;
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}

.error-message {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid #ff4757;
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}

/* Profile Wrapper */
.profile-wrapper {
    max-width: 900px;
    margin: 0 auto;
}

/* Cover Image */
.profile-cover {
    width: 100%;
    height: 250px;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    position: relative;
}

.profile-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cover-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1DB954 0%, #191414 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.cover-placeholder span {
    color: rgba(255, 255, 255, 0.3);
    font-size: 24px;
    font-weight: 600;
}

/* Profile Card (View Mode) */
.profile-card {
    background: #181818;
    border-radius: 0 0 12px 12px;
    padding: 40px;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 50px;
    align-items: start;
    margin-top: -60px;
    position: relative;
}

.profile-card-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -100px;
}

.profile-avatar-large {
    position: relative;
    width: 200px;
    height: 200px;
}

.profile-avatar-large img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid #181818;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    display: block;
}

.avatar-placeholder-large {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #1DB954, #1ed760);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    font-weight: 900;
    color: #000;
    border: 6px solid #181818;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.profile-card-right {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-top: 20px;
}

.profile-name {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    margin: 0;
}

.profile-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #282828;
}

.stat-label {
    color: #b3b3b3;
    font-size: 14px;
    font-weight: 500;
}

.stat-value {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
}

.profile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.profile-actions button,
.profile-actions a {
    padding: 14px 24px;
    border: none;
    border-radius: 500px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
}

.btn-secondary {
    background: #282828;
    color: #fff;
    border: 1px solid #404040;
}

.btn-secondary:hover {
    background: #333;
    border-color: #fff;
}

.btn-warning {
    background: #ff9500;
    color: #000;
}

.btn-warning:hover {
    background: #ffb000;
}

.btn-danger {
    background: #e74c3c;
    color: #fff;
}

.btn-danger:hover {
    background: #c0392b;
}

/* Profile Edit (Edit Mode) */
.profile-edit-wrapper {
    max-width: 900px;
    margin: 0 auto;
}

.profile-cover-edit {
    width: 100%;
    height: 250px;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    position: relative;
}

.profile-cover-edit img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cover-upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.profile-cover-edit:hover .cover-upload-overlay {
    opacity: 1;
}

.btn-upload-cover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 12px 24px;
    border-radius: 500px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.2s;
}

.btn-upload-cover:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #fff;
}

.profile-edit-card {
    background: #181818;
    border-radius: 0 0 12px 12px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.profile-avatar-edit {
    position: relative;
    width: 160px;
    height: 160px;
}

.profile-avatar-edit img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #1DB954;
    display: block;
}

.avatar-placeholder-edit {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #1DB954, #1ed760);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3.5rem;
    font-weight: 900;
    color: #000;
}

.profile-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group input[type="text"] {
    padding: 12px 16px;
    background: #121212;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    transition: all 0.2s;
}

.form-group input[type="text"]:focus {
    outline: none;
    border-color: #1DB954;
    background: #1a1a1a;
}

.btn-upload {
    padding: 12px 24px;
    background: #1DB954;
    color: #000;
    border: none;
    border-radius: 500px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
}

.btn-upload:hover {
    background: #1ed760;
}

.btn-upload:disabled {
    background: #888;
    cursor: not-allowed;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;
    width: 100%;
}

.form-actions button {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 500px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.form-actions .btn-primary:hover {
    background: #1ed760;
}

.form-actions .btn-secondary:hover {
    background: #333;
    border-color: #fff;
}

@media (max-width: 768px) {
    .profile-page {
        padding: 40px 20px;
    }

    .profile-card {
        grid-template-columns: 1fr;
        gap: 30px;
        padding: 30px;
    }

    .profile-card-left {
        order: -1;
    }

    .profile-avatar-large {
        width: 150px;
        height: 150px;
    }

    .profile-name {
        font-size: 1.5rem;
    }

    .profile-actions {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .profile-actions button,
    .profile-actions a {
        flex: 1 1 auto;
        min-width: 120px;
    }

    .profile-edit-card {
        padding: 30px;
    }

    .profile-avatar-edit {
        width: 120px;
        height: 120px;
    }

    .avatar-placeholder-edit {
        font-size: 2.5rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .form-actions button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .profile-page {
        padding: 20px 15px;
    }

    .profile-card {
        gap: 20px;
        padding: 20px;
    }

    .profile-avatar-large {
        width: 120px;
        height: 120px;
    }

    .avatar-placeholder-large {
        font-size: 3rem;
    }

    .profile-name {
        font-size: 1.2rem;
    }

    .stat-item {
        font-size: 12px;
    }

    .profile-actions button,
    .profile-actions a {
        padding: 12px 16px;
        font-size: 12px;
        min-width: auto;
    }

    .profile-edit-card {
        padding: 20px;
    }

    .profile-avatar-edit {
        width: 100px;
        height: 100px;
    }

    .avatar-placeholder-edit {
        font-size: 2rem;
    }
}
```

---

## Admin Dashboard

```css
/* Admin Dashboard */
.admin-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 60px;
}

/* Header */
.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid #282828;
}

.header-left h1 {
    font-size: 3.5rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 8px 0;
}

.header-left p {
    color: #b3b3b3;
    font-size: 1rem;
    margin: 0;
}

.header-left p strong {
    color: #fff;
    font-weight: 600;
}

.header-right {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

/* Stats Container */
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.stat-card {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 4px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.stat-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(29, 185, 84, 0.1);
    border-radius: 4px;
}

.stat-info h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 4px 0;
}

.stat-info p {
    color: #b3b3b3;
    font-size: 14px;
    margin: 0;
}

/* Admin Card */
.admin-card {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 4px;
    padding: 24px;
}

.admin-card h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 24px 0;
}

/* User Table */
.user-table {
    width: 100%;
    border-collapse: collapse;
}

.user-table thead {
    border-bottom: 1px solid #282828;
}

.user-table th {
    padding: 12px 16px;
    text-align: left;
    color: #b3b3b3;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.user-table td {
    padding: 16px;
    border-bottom: 1px solid #282828;
    color: #fff;
    font-size: 14px;
}

.user-table tbody tr.current-user {
    background: rgba(29, 185, 84, 0.1);
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar-small {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 14px;
    color: #000;
    flex-shrink: 0;
}

.you-badge {
    background: #1DB954;
    color: #000;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 500px;
    font-size: 12px;
    font-weight: 600;
}

.badge.admin {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #000;
}

.badge.user {
    background: rgba(29, 185, 84, 0.2);
    color: #1DB954;
    border: 1px solid #1DB954;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.btn-sm {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 500px;
    border: none;
    cursor: pointer;
}

.btn-success {
    background: #1DB954;
    color: #000;
}

.btn-warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid #ffc107;
}

.btn-danger {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    border: 1px solid #ff4757;
}

.btn-sm:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* Messages */
.success-message {
    background: rgba(29, 185, 84, 0.2);
    color: #1DB954;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #1DB954;
    font-size: 14px;
}

.error-message {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #ff4757;
    font-size: 14px;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #b3b3b3;
    font-size: 1.2rem;
}

@media (max-width: 1024px) {
    .admin-container {
        padding: 30px 40px;
    }

    .header-left h1 {
        font-size: 2.8rem;
    }

    .stats-container {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
}

@media (max-width: 768px) {
    .admin-container {
        padding: 20px;
    }

    .admin-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }

    .header-left h1 {
        font-size: 2.2rem;
    }

    .header-right {
        width: 100%;
        justify-content: flex-start;
    }

    .stats-container {
        grid-template-columns: 1fr;
    }

    .user-table {
        font-size: 12px;
    }

    .user-table th,
    .user-table td {
        padding: 12px 8px;
    }

    .user-cell {
        gap: 8px;
    }

    .avatar-small {
        width: 32px;
        height: 32px;
        font-size: 12px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 4px;
    }

    .btn-sm {
        padding: 6px 12px;
        font-size: 11px;
    }
}

@media (max-width: 480px) {
    .admin-container {
        padding: 15px;
    }

    .header-left h1 {
        font-size: 1.8rem;
    }

    .admin-card {
        padding: 16px;
    }

    .user-table {
        display: block;
        overflow-x: auto;
    }
}
```

---

## Song Management

```css
/* Song Management */
.song-management-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 60px;
}

/* Header */
.song-management-header {
    text-align: center;
    margin-bottom: 40px;
}

.song-management-header h1 {
    font-size: 3.5rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 8px 0;
}

.song-management-header p {
    color: #b3b3b3;
    font-size: 1rem;
    margin: 0;
}

/* Header Buttons */
.header-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
    flex-wrap: wrap;
}

/* Search Section */
.search-section {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 24px;
}

.search-controls {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 12px;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 12px 16px;
    background: #121212;
    border: 1px solid #727272;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
}

.search-input:focus {
    outline: none;
    border-color: #fff;
}

.search-input::placeholder {
    color: #727272;
}

/* Song Table Section */
.song-table-section {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 4px;
    padding: 24px;
}

.song-table-section h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 24px 0;
}

/* Table Styles */
.song-table {
    width: 100%;
    border-collapse: collapse;
}

.song-table thead {
    border-bottom: 1px solid #282828;
}

.song-table th {
    padding: 12px 16px;
    text-align: left;
    color: #b3b3b3;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.song-table td {
    padding: 16px;
    border-bottom: 1px solid #282828;
    color: #fff;
    font-size: 14px;
}

/* Button Styles */
.btn-primary {
    background: #1DB954;
    color: #000;
    padding: 12px 24px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
}

.btn-secondary {
    background: transparent;
    border: 1px solid #727272;
    color: #fff;
    padding: 12px 24px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
}

.btn-danger {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    border: 1px solid #ff4757;
    padding: 12px 24px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
}

.btn-warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid #ffc107;
    padding: 12px 24px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
}

.btn-sm {
    padding: 8px 16px;
    font-size: 12px;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: #181818;
    border: 1px solid #282828;
    border-radius: 8px;
    padding: 32px;
    width: 90%;
    max-width: 500px;
}

.modal-content h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 24px 0;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: #fff;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    background: #121212;
    border: 1px solid #727272;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
}

.form-group input:focus {
    outline: none;
    border-color: #fff;
}

.form-group input::placeholder {
    color: #727272;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.modal-buttons button {
    flex: 1;
}

/* Messages */
.success-message {
    background: rgba(29, 185, 84, 0.2);
    color: #1DB954;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #1DB954;
    font-size: 14px;
}

.error-message {
    background: rgba(255, 71, 87, 0.2);
    color: #ff4757;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #ff4757;
    font-size: 14px;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #b3b3b3;
    font-size: 1.2rem;
}

@media (max-width: 1024px) {
    .song-management-container {
        padding: 30px 40px;
    }

    .song-management-header h1 {
        font-size: 2.8rem;
    }
}

@media (max-width: 768px) {
    .song-management-container {
        padding: 20px;
    }

    .song-management-header h1 {
        font-size: 2.2rem;
    }

    .search-controls {
        flex-direction: column;
    }

    .search-controls button {
        width: 100%;
    }

    .header-actions {
        flex-direction: column;
    }

    .header-actions button {
        width: 100%;
    }

    .song-table {
        font-size: 12px;
    }

    .song-table th,
    .song-table td {
        padding: 12px 8px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 4px;
    }
}

@media (max-width: 480px) {
    .song-management-container {
        padding: 15px;
    }

    .song-management-header h1 {
        font-size: 1.8rem;
    }

    .modal-content {
        padding: 20px;
    }

    .song-table {
        display: block;
        overflow-x: auto;
    }
}
```

---

## Key Color Variables

| Variable | Color | Usage |
|----------|-------|-------|
| `--spotify-green` | `#1DB954` | Primary buttons, highlights |
| `--spotify-green-hover` | `#1ed760` | Button hover state |
| `--spotify-black` | `#000` | Background |
| `--spotify-dark` | `#121212` | Primary card background |
| `--spotify-gray` | `#181818` | Secondary cards |
| `--spotify-light-gray` | `#282828` | Borders, hover states |
| `--spotify-text` | `#fff` | Primary text |
| `--spotify-text-muted` | `#b3b3b3` | Secondary text |
| Like button color | `#e74c3c` | Liked songs indicator |
| Red badge | `#e74c3c` | Notification badge |

---

## Notes for Implementation

1. **Font Family**: Uses system fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'`)
2. **Focus Styles**: All focus outlines are disabled (`outline: none !important`)
3. **Dark Theme**: Pure black background (`#000`) with dark gray cards (`#181818`, `#121212`)
4. **Responsive Design**: Mobile-first approach with breakpoints at 1024px, 768px, and 480px
5. **Spotify Color Scheme**: Green primary (`#1DB954`) with red accent for likes (`#e74c3c`)
6. **Player Bar**: Fixed at bottom with 90px height on desktop, responsive on mobile
7. **Icons**: SVG icons with `filter: invert(1)` to appear white
8. **Animations**: Smooth transitions (0.2s-0.4s) for interactive elements
9. **Glassmorphism**: Some cards use `backdrop-filter: blur(10px)` for glass effect
10. **Gradients**: Linear and radial gradients used for hero sections and CTAs

This CSS guide provides complete styling for the Spotify-style music web application. All styles are organized by component and include responsive design breakpoints for mobile devices.

---

## Layout Structure & Best Practices

### Main App Layout Structure

```jsx
// App.jsx - Root component structure
function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/playlists" element={<PlaylistManager />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/songs" element={<SongManagement />} />
          </Routes>
        </Layout>
        <MusicPlayer />
      </div>
    </BrowserRouter>
  );
}
```

### Layout Component Structure

```jsx
// components/Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="main-header">
        <div className="header-container">
          {/* Logo & Navigation */}
          <div className="header-left">
            <Link to="/" className="logo">
              <img src="/logo.svg" className="logo-icon" alt="Logo" />
              <span className="logo-text">E-Project</span>
            </Link>
            <nav className="main-nav">
              <Link to="/music" className="nav-link">Music</Link>
              <Link to="/playlists" className="nav-link">Playlists</Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="header-center">
            <SearchBar />
          </div>

          {/* Notifications & User Menu */}
          <div className="header-right">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="main-footer">
        <div className="footer-container">
          {/* Footer content */}
        </div>
      </footer>
    </div>
  );
}
```

### Page Container Structure

```jsx
// Pattern for all pages
export default function PageName() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Page Title</h1>
        <p>Page description</p>
      </header>

      <section className="page-content">
        {/* Page content goes here */}
      </section>
    </div>
  );
}
```

### Component Pattern Structure

```jsx
// Pattern for reusable components
export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Initialize or fetch data
  }, []);

  return (
    <div className="component-wrapper">
      <div className="component-header">
        <h2>Component Title</h2>
      </div>
      <div className="component-content">
        {/* Component content */}
      </div>
      <div className="component-footer">
        {/* Footer if needed */}
      </div>
    </div>
  );
}
```

---

## CSS File Organization

### File Structure
```
src/
├── index.css              # Global variables, resets, base styles
├── App.css                # Auth, forms, buttons, messages, modals
├── components/
│   ├── Layout.css         # Header, nav, notifications, footer
│   ├── MusicPlayer.css    # Music player bar, controls, volume
│   └── PlaylistManager.css # Playlist grid, modals, detail view
└── pages/
    ├── HomePage.css       # Hero, features, CTA sections
    ├── MusicPage.css      # Songs grid, search, like buttons
    ├── ProfilePage.css    # Profile cards, avatars, forms
    ├── AdminDashboard.css # Stats, user tables, badges
    └── SongManagement.css # Song tables, modals, forms
```

### CSS Organization Rules

1. **Single Responsibility**: Each CSS file handles one main component/page
2. **Nested Structure**: Organize selectors by parent-child hierarchy
3. **Responsive First**: Mobile styles first, then tablet, then desktop
4. **Comment Sections**: Use clear section separators with comments
5. **Variable Usage**: Always use CSS variables for colors and common values

### CSS Naming Conventions

```css
/* Block-Element-Modifier (BEM) Pattern */

/* Block - standalone component */
.song-card { }

/* Element - part of a block */
.song-card__image { }
.song-card__title { }
.song-card__artist { }

/* Modifier - variant of a block or element */
.song-card--active { }
.song-card__image--playing { }

/* OR use simplified naming for readability */
.song-card { }
.song-card-image { }
.song-card-title { }
.song-card.active { }
```

---

## Component Best Practices

### Page Container Pattern
```jsx
// All pages should follow this structure
export default function PageName() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch data
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-name-page">
      <div className="page-container">
        <header className="page-header">
          <h1>Page Title</h1>
        </header>
        <main className="page-content">
          {/* Content here */}
        </main>
      </div>
    </div>
  );
}
```

### Modal Component Pattern
```jsx
export default function ModalName({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modal Title</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* Modal content */}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
```

### Form Component Pattern
```jsx
export default function FormName({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <div className="form-group">
        <label htmlFor="field">Field Label</label>
        <input
          id="field"
          name="field"
          type="text"
          value={formData.field}
          onChange={handleChange}
          className={errors.field ? 'input-error' : ''}
        />
        {errors.field && <span className="error-text">{errors.field}</span>}
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Grid/List Component Pattern
```jsx
export default function ItemList({ items, loading, onItemClick }) {
  if (loading) return <div className="loading">Loading items...</div>;
  if (!items?.length) return <div className="empty-state">No items found</div>;

  return (
    <div className="items-grid">
      {items.map(item => (
        <div
          key={item.id}
          className="item-card"
          onClick={() => onItemClick(item)}
          role="button"
          tabIndex={0}
        >
          <div className="item-image">{item.icon}</div>
          <div className="item-info">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## API Service Pattern

```javascript
// services/api.js - Centralized API calls
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

// Music APIs
export const musicAPI = {
  getSongs: (params) => api.get('/songs', { params }),
  getSongById: (id) => api.get(`/songs/${id}`),
  createSong: (data) => api.post('/songs', data),
  updateSong: (id, data) => api.put(`/songs/${id}`, data),
  deleteSong: (id) => api.delete(`/songs/${id}`),
};

// Playlist APIs
export const playlistAPI = {
  getPlaylists: () => api.get('/playlists'),
  getPlaylistById: (id) => api.get(`/playlists/${id}`),
  createPlaylist: (data) => api.post('/playlists', data),
  updatePlaylist: (id, data) => api.put(`/playlists/${id}`, data),
  deletePlaylist: (id) => api.delete(`/playlists/${id}`),
  addSongToPlaylist: (playlistId, songId) => 
    api.post(`/playlists/${playlistId}/songs`, { songId }),
  removeSongFromPlaylist: (playlistId, songId) => 
    api.delete(`/playlists/${playlistId}/songs/${songId}`),
};

// Like APIs
export const likedSongAPI = {
  getLikedSongs: () => api.get('/liked-songs'),
  getLikedSongIds: () => api.get('/liked-songs/ids'),
  likeSong: (songId) => api.post('/liked-songs', { songId }),
  unlikeSong: (songId) => api.delete(`/liked-songs/${songId}`),
  checkLiked: (songId) => api.get(`/liked-songs/check/${songId}`),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
```

---

## State Management Pattern (Context API)

```javascript
// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      // Verify token is still valid
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```javascript
// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Responsive Design Strategy

### Mobile First Approach
```css
/* Base styles for mobile (320px and up) */
.component {
  padding: 15px 20px;
  font-size: 14px;
}

/* Tablet styles (768px and up) */
@media (min-width: 768px) {
  .component {
    padding: 20px 30px;
    font-size: 16px;
  }
}

/* Desktop styles (1024px and up) */
@media (min-width: 1024px) {
  .component {
    padding: 30px 60px;
    font-size: 18px;
  }
}
```

### Key Breakpoints
- **Mobile**: 480px and below
- **Tablet**: 481px - 1024px
- **Desktop**: 1025px and above

---

## Performance Best Practices

### Image Optimization
```jsx
// Use SVGs for icons
<img src="/logo.svg" className="logo-icon" alt="Logo" />

// Use proper image formats
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.png" alt="Description" />
</picture>
```

### CSS Optimization
```css
/* Use CSS variables for frequently used values */
:root {
  --color-primary: #1DB954;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* Avoid deep nesting */
/* ❌ Don't do this */
.header .container .nav .item .link { }

/* ✅ Do this instead */
.nav-link { }

/* Use shorthand properties */
/* ❌ Don't do this */
margin-top: 10px;
margin-right: 10px;
margin-bottom: 10px;
margin-left: 10px;

/* ✅ Do this instead */
margin: 10px;
```

### Component Performance
```jsx
// Use React.memo for components that don't need frequent re-renders
export default React.memo(function SongCard({ song, onPlay }) {
  return (
    <div className="song-card" onClick={() => onPlay(song)}>
      {/* Card content */}
    </div>
  );
});

// Use useCallback for event handlers
const handleLike = useCallback((songId) => {
  likeSong(songId);
}, []);

// Use useMemo for expensive computations
const filteredSongs = useMemo(() => {
  return songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [songs, searchTerm]);
```

---

## Complete Page Example: Music Page

```jsx
// pages/MusicPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { musicAPI, likedSongAPI } from '../services/api';
import './MusicPage.css';

export default function MusicPage() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [likedSongIds, setLikedSongIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    filterSongs();
  }, [songs, searchTerm]);

  const initializePage = async () => {
    try {
      setLoading(true);
      const [songsRes, likedRes] = await Promise.all([
        musicAPI.getSongs(),
        likedSongAPI.getLikedSongIds(),
      ]);
      setSongs(songsRes.data);
      setLikedSongIds(likedRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredSongs(songs);
      return;
    }
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered);
    setCurrentPage(1);
  }, [songs, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLikeToggle = useCallback(async (songId) => {
    try {
      if (likedSongIds.includes(songId)) {
        await likedSongAPI.unlikeSong(songId);
        setLikedSongIds(prev => prev.filter(id => id !== songId));
      } else {
        await likedSongAPI.likeSong(songId);
        setLikedSongIds(prev => [...prev, songId]);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }, [likedSongIds]);

  const handlePlaySong = (song) => {
    setSelectedSong(song);
    // Dispatch to global player state
  };

  if (loading) return <div className="loading">Loading music...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="music-page">
      <div className="page-container">
        <header className="music-header">
          <h1>My Music Library</h1>
          <p>Discover and enjoy your favorite songs</p>
        </header>

        <section className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar__input"
            />
            <button className="search-bar__button">Search</button>
          </div>
        </section>

        <section className="songs-container">
          <h2>
            {searchTerm ? `Search results (${filteredSongs.length})` : 'All Songs'}
          </h2>
          
          {filteredSongs.length === 0 ? (
            <div className="empty-state">
              <h3>No songs found</h3>
              <p>Try searching for something else</p>
            </div>
          ) : (
            <div className="songs-grid">
              {filteredSongs.map(song => (
                <div key={song.id} className="song-card">
                  <div className="song-card-image">
                    <div className="song-image-placeholder">
                      <span>♪</span>
                    </div>
                    <div className="play-button-overlay">
                      <button
                        className="play-button"
                        onClick={() => handlePlaySong(song)}
                        title="Play song"
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  <div className="song-card-info">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>

                  <div className="song-card-actions">
                    <button
                      className={`btn-like ${
                        likedSongIds.includes(song.id) ? 'liked' : ''
                      }`}
                      onClick={() => handleLikeToggle(song.id)}
                      title={
                        likedSongIds.includes(song.id) ? 'Unlike' : 'Like'
                      }
                    >
                      ♥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
```

---

## Database Schema Best Practices

### Song Table
```sql
CREATE TABLE Songs (
    SongId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Artist NVARCHAR(255) NOT NULL,
    Album NVARCHAR(255),
    Duration INT, -- in seconds
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

### User Liked Songs Table
```sql
CREATE TABLE LikedSongs (
    LikedSongId INT PRIMARY KEY IDENTITY(1,1),
    UserId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES AspNetUsers(Id),
    SongId INT NOT NULL FOREIGN KEY REFERENCES Songs(SongId),
    LikedAt DATETIME DEFAULT GETDATE(),
    UNIQUE(UserId, SongId) -- Prevent duplicate likes
);
```

### Playlist Table
```sql
CREATE TABLE Playlists (
    PlaylistId INT PRIMARY KEY IDENTITY(1,1),
    UserId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES AspNetUsers(Id),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(1000),
    IsPublic BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE PlaylistSongs (
    PlaylistSongId INT PRIMARY KEY IDENTITY(1,1),
    PlaylistId INT NOT NULL FOREIGN KEY REFERENCES Playlists(PlaylistId),
    SongId INT NOT NULL FOREIGN KEY REFERENCES Songs(SongId),
    AddedAt DATETIME DEFAULT GETDATE()
);
```

### Notification Table
```sql
CREATE TABLE Notifications (
    NotificationId INT PRIMARY KEY IDENTITY(1,1),
    UserId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES AspNetUsers(Id),
    FromUserId NVARCHAR(450),
    Type NVARCHAR(50), -- 'like', 'follow', 'playlist', 'system'
    Title NVARCHAR(255),
    Message NVARCHAR(1000),
    Link NVARCHAR(500),
    RelatedId INT,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

---

## Summary Checklist

✅ **CSS & Styling**
- All pages have complete CSS
- Responsive design for all breakpoints
- Spotify color scheme applied consistently
- Smooth animations and transitions

✅ **Layout & Structure**
- Header with navigation and search
- Main content area with proper padding
- Fixed music player at bottom
- Footer with links

✅ **Components & Pages**
- HomePage - Hero, features, CTA
- MusicPage - Songs grid, search, like buttons
- PlaylistManager - Playlists grid, detail view
- ProfilePage - User profile with edit mode
- AdminDashboard - Stats and user management
- SongManagement - Song CRUD operations

✅ **Code Patterns**
- API service centralization
- Context API for state management
- Component composition patterns
- Error handling and loading states
- Form validation and submission

✅ **Database**
- Proper relationships and constraints
- Unique constraints for data integrity
- Timestamps for audit tracking
- Foreign keys for referential integrity

The project is now complete with production-ready CSS, layout structure, and proper code organization! 🎵
