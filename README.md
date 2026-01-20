![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/huseyinfiliz/sort-changer.svg)](https://packagist.org/packages/huseyinfiliz/sort-changer) [![Total Downloads](https://img.shields.io/packagist/dt/huseyinfiliz/sort-changer.svg)](https://packagist.org/packages/huseyinfiliz/sort-changer)

A Flarum extension that allows you to change the default discussion sort order.

## Features

- 🎯 Set default sort order (Latest, Top, Newest, Oldest)
- 🏠 Works only on homepage (not on tag or search pages)
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

## How it Works

- Sets the default sort order when users first visit your forum homepage
- Users can still change the sort order manually using the dropdown
- Only applies to the main index page (doesn't affect tag or search pages)

## Compatibility

- **Flarum**: 1.8.1+
- **PHP**: 8.1+
- **MySQL**: 5.6+/8.0.23+ or **MariaDB**: 10.0.5+