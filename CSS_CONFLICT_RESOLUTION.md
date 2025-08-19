# CSS Conflict Resolution Guide

## Overview
This document outlines all the CSS conflicts that were identified and resolved across the project's CSS files. The main issues were:

1. **Duplicate CSS resets** causing global style conflicts
2. **Identical class names** across different pages
3. **Conflicting button styles** with the same names
4. **Duplicate font imports** and animations

## Changes Made

### 1. Home.css
- **Before**: Had global CSS reset (`*`, `html, body`)
- **After**: Wrapped in `.home-page` class, renamed all classes with `home-` prefix
- **Classes changed**:
  - `.tagline` → `.home-tagline`
  - `.assessment-card` → `.home-assessment-card`
  - `.sample-link` → `.home-sample-link`
  - `.particles` → `.home-particles`
  - `.particle` → `.home-particle`
  - `@keyframes float` → `@keyframes homeFloat`

### 2. Login.css
- **Before**: Had global CSS reset and generic class names
- **After**: Wrapped in `.login-page` class, renamed all classes with `login-` prefix
- **Classes changed**:
  - `.logo-bar` → `.login-logo-bar`
  - `.vertical-divider` → `.login-vertical-divider`
  - `form` → `.login-form`
  - `.error-message` → `.login-error-message`
  - `.success-message` → `.login-success-message`
  - `.resend-verification` → `.login-resend-verification`
  - `.resend-button` → `.login-resend-button`
  - `.divider-row` → `.login-divider-row`
  - `.divider-line` → `.login-divider-line`
  - `.divider-text` → `.login-divider-text`
  - All animations renamed with `login` prefix

### 3. Register.css
- **Before**: Had global CSS reset and generic class names
- **After**: Wrapped in `.register-page` class, renamed all classes with `register-` prefix
- **Classes changed**:
  - `.logo-bar` → `.register-logo-bar`
  - `.vertical-divider` → `.register-vertical-divider`
  - `.tagline` → `.register-tagline`
  - `.error-message` → `.register-error-message`
  - `.divider-row` → `.register-divider-row`
  - `.divider-line` → `.register-divider-line`
  - `.divider-text` → `.register-divider-text`
  - All animations renamed with `register` prefix

### 4. adminDashboard.css
- **Before**: Had global CSS reset and generic dashboard classes
- **After**: Wrapped in `.admin-page` class, renamed all classes with `admin-` prefix
- **Classes changed**:
  - `.dashboard-container` → `.admin-dashboard-container`
  - `.dashboard-content` → `.admin-dashboard-content`
  - `.dashboard-main-grid` → `.admin-dashboard-main-grid`
  - `.dashboard-left-side` → `.admin-dashboard-left-side`
  - `.dashboard-right-side` → `.admin-dashboard-right-side`
  - `.dashboard-right-top` → `.admin-dashboard-right-top`
  - `.dashboard-divider` → `.admin-dashboard-divider`
  - `.vertical-divider-small` → `.admin-vertical-divider-small`
  - `.horizontal-divider` → `.admin-horizontal-divider`
  - `.problems-list` → `.admin-problems-list`
  - `.submissions-list` → `.admin-submissions-list`
  - `.problem-item` → `.admin-problem-item`
  - `.submission-item` → `.admin-submission-item`
  - `.submission-content` → `.admin-submission-content`
  - `.submission-title` → `.admin-submission-title`
  - `.submission-details` → `.admin-submission-details`
  - `.submission-user` → `.admin-submission-user`
  - `.submission-status` → `.admin-submission-status`
  - `.submission-language` → `.admin-submission-language`
  - `.quick-actions` → `.admin-quick-actions`
  - `.action-btn` → `.admin-action-btn`
  - `.stats-grid` → `.admin-stats-grid`
  - `.stat-item` → `.admin-stat-item`

### 5. candidateDashboard.css
- **Before**: Had global CSS reset and generic dashboard classes
- **After**: Wrapped in `.candidate-page` class, renamed all classes with `candidate-` prefix
- **Classes changed**:
  - `.dashboard-container` → `.candidate-dashboard-container`
  - `.dashboard-content` → `.candidate-dashboard-content`
  - `.dashboard-main-grid` → `.candidate-dashboard-main-grid`
  - `.dashboard-left-side` → `.candidate-dashboard-left-side`
  - `.dashboard-right-side` → `.candidate-dashboard-right-side`
  - `.dashboard-right-top` → `.candidate-dashboard-right-top`
  - `.dashboard-divider` → `.candidate-dashboard-divider`
  - `.vertical-divider-small` → `.candidate-vertical-divider-small`
  - `.horizontal-divider` → `.candidate-horizontal-divider`

### 6. ProblemPage.css
- **Before**: Had generic button classes that conflicted with other pages
- **After**: Renamed all button classes with `problem-` prefix
- **Classes changed**:
  - `.restart-btn` → `.problem-restart-btn`
  - `.exit-btn` → `.problem-exit-btn`
  - `.run-btn` → `.problem-run-btn`
  - `.submit-btn` → `.problem-submit-btn`
  - `html, body` → `.problem-page`

### 7. AddProblem.css
- **Before**: Had global CSS reset and generic form classes
- **After**: Wrapped in `.add-problem-page` class, renamed all classes with `add-problem-` prefix
- **Classes changed**:
  - `.form-panel` → `.add-problem-form-panel`
  - `.form-group` → `.add-problem-form-group`
  - `.form-row` → `.add-problem-form-row`
  - `.form-actions` → `.add-problem-form-actions`
  - `.cancel-btn` → `.add-problem-cancel-btn`
  - `.submit-btn` → `.add-problem-submit-btn`
  - `.error-message` → `.add-problem-error-message`
  - `.success-message` → `.add-problem-success-message`
  - `.preview-panel` → `.add-problem-preview-panel`
  - `.preview-card` → `.add-problem-preview-card`
  - `.preview-content` → `.add-problem-preview-content`
  - `.preview-title-section` → `.add-problem-preview-title-section`
  - `.preview-title` → `.add-problem-preview-title`
  - `.preview-difficulty` → `.add-problem-preview-difficulty`
  - `.preview-description` → `.add-problem-preview-description`
  - `.preview-constraints` → `.add-problem-preview-constraints`
  - `.preview-samples` → `.add-problem-preview-samples`
  - `.preview-visual` → `.add-problem-preview-visual`
  - `.preview-sample` → `.add-problem-preview-sample`
  - `.sample-content` → `.add-problem-sample-content`
  - `.vertical-divider-gold` → `.add-problem-vertical-divider-gold`

### 8. index.css (Global)
- **Added**: Page-specific wrapper classes to prevent conflicts
- **Added**: Common utility classes for buttons, forms, cards, and dividers
- **Added**: Consolidated styles to reduce duplication

## Required React Component Updates

### Home.js
```jsx
// Add wrapper class
<div className="home-page">
  {/* existing content */}
</div>

// Update class names
<div className="home-tagline">...</div>
<div className="home-assessment-card">...</div>
<a className="home-sample-link">...</div>
<div className="home-particles">...</div>
```

### Login.js
```jsx
// Add wrapper class
<div className="login-page">
  {/* existing content */}
</div>

// Update class names
<div className="login-logo-bar">...</div>
<div className="login-vertical-divider">...</div>
<form className="login-form">...</form>
<div className="login-error-message">...</div>
<div className="login-success-message">...</div>
<div className="login-resend-verification">...</div>
<button className="login-resend-button">...</button>
<div className="login-divider-row">...</div>
<div className="login-divider-line">...</div>
<span className="login-divider-text">...</span>
```

### Register.js
```jsx
// Add wrapper class
<div className="register-page">
  {/* existing content */}
</div>

// Update class names
<div className="register-logo-bar">...</div>
<div className="register-vertical-divider">...</div>
<div className="register-tagline">...</div>
<form className="register-form">...</form>
<div className="register-error-message">...</div>
<div className="register-divider-row">...</div>
<div className="register-divider-line">...</div>
<span className="register-divider-text">...</span>
```

### adminDashboard.js
```jsx
// Add wrapper class
<div className="admin-page">
  {/* existing content */}
</div>

// Update class names
<div className="admin-dashboard-container">...</div>
<div className="admin-dashboard-content">...</div>
<div className="admin-dashboard-main-grid">...</div>
<div className="admin-dashboard-left-side">...</div>
<div className="admin-dashboard-right-side">...</div>
<div className="admin-dashboard-right-top">...</div>
<div className="admin-dashboard-divider">...</div>
<div className="admin-vertical-divider-small">...</div>
<div className="admin-horizontal-divider">...</div>
<div className="admin-card">...</div>
<ul className="admin-problems-list">...</ul>
<ul className="admin-submissions-list">...</ul>
<li className="admin-problem-item">...</li>
<li className="admin-submission-item">...</li>
<div className="admin-submission-content">...</div>
<div className="admin-submission-title">...</div>
<div className="admin-submission-details">...</div>
<div className="admin-submission-user">...</div>
<div className="admin-submission-status">...</div>
<div className="admin-submission-language">...</div>
<div className="admin-quick-actions">...</div>
<button className="admin-action-btn">...</button>
<div className="admin-stats-grid">...</div>
<div className="admin-stat-item">...</div>
```

### candidateDashboard.js
```jsx
// Add wrapper class
<div className="candidate-page">
  {/* existing content */}
</div>

// Update class names
<div className="candidate-dashboard-container">...</div>
<div className="candidate-dashboard-content">...</div>
<div className="candidate-dashboard-main-grid">...</div>
<div className="candidate-dashboard-left-side">...</div>
<div className="candidate-dashboard-right-side">...</div>
<div className="candidate-dashboard-right-top">...</div>
<div className="candidate-dashboard-divider">...</div>
<div className="candidate-vertical-divider-small">...</div>
<div className="candidate-horizontal-divider">...</div>
```

### ProblemPage.js
```jsx
// Add wrapper class
<div className="problem-page">
  {/* existing content */}
</div>

// Update button class names
<button className="problem-restart-btn">...</button>
<button className="problem-exit-btn">...</button>
<button className="problem-run-btn">...</button>
<button className="problem-submit-btn">...</button>
```

### AddProblem.js
```jsx
// Add wrapper class
<div className="add-problem-page">
  {/* existing content */}
</div>

// Update class names
<div className="add-problem-form-panel">...</div>
<div className="add-problem-form-group">...</div>
<div className="add-problem-form-row">...</div>
<div className="add-problem-form-actions">...</div>
<button className="add-problem-cancel-btn">...</button>
<button className="add-problem-submit-btn">...</button>
<div className="add-problem-error-message">...</div>
<div className="add-problem-success-message">...</div>
<div className="add-problem-preview-panel">...</div>
<div className="add-problem-preview-card">...</div>
<div className="add-problem-preview-content">...</div>
<div className="add-problem-preview-title-section">...</div>
<div className="add-problem-preview-title">...</div>
<div className="add-problem-preview-difficulty">...</div>
<div className="add-problem-preview-description">...</div>
<div className="add-problem-preview-constraints">...</div>
<div className="add-problem-preview-samples">...</div>
<div className="add-problem-preview-visual">...</div>
<div className="add-problem-preview-sample">...</div>
<div className="add-problem-sample-content">...</div>
<div className="add-problem-vertical-divider-gold">...</div>
```

## Benefits of These Changes

1. **Eliminated CSS conflicts** between pages
2. **Improved maintainability** with clear naming conventions
3. **Better organization** with page-specific styles
4. **Reduced duplication** with common utility classes
5. **Consistent styling** across all pages
6. **Easier debugging** with unique class names

## Next Steps

1. Update all React components with the new class names
2. Test each page to ensure styles are working correctly
3. Remove any unused CSS classes
4. Consider using CSS modules or styled-components for future development to prevent similar issues

## Common Utility Classes Available

The following common classes are now available in `index.css`:

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.form-input` - Standard form input styling
- `.card` - Standard card styling
- `.divider-vertical` - Vertical divider styling
- `.divider-horizontal` - Horizontal divider styling

Use these classes instead of creating duplicate styles across different pages. 