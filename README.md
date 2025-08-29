![License](https://img.shields.io/badge/license-MIT-blue.svg)

A Flarum extension that allows you to change the default discussion sort order.

## Features

- 🎯 Set default sort order (Latest, Top, Newest, Oldest)
- 🏠 Works only on homepage (not on tag or search pages)
- 🔗 Clean URLs for default sort option
- ⚡ Seamless user experience

## Installation

Install with composer:

```bash
composer require huseyinfiliz/sort-changer
```

Updating

```bash
composer update huseyinfiliz/sort-changer
php flarum cache:clear
```

## Configuration

1. Enable the extension in admin panel
2. Go to extension settings
3. Select your preferred default sort order:
   - **Latest**: Shows discussions with most recent replies
   - **Top**: Shows most popular discussions
   - **Newest**: Shows newest created discussions
   - **Oldest**: Shows oldest created discussions
4. Save changes

## How it Works

- Sets the default sort order when users first visit your forum homepage
- Users can still change the sort order manually using the dropdown
- Clean URLs: Hides the sort parameter when the default option is selected
- Only applies to the main index page (doesn't affect tag or search pages)

## Compatibility

- **Flarum**: 1.8.1+
- **PHP**: 8.1+
- **MySQL**: 5.6+/8.0.23+ or **MariaDB**: 10.0.5+
- Works with both Nginx and Apache