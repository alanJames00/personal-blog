---
author: Alan James
pubDatetime: 2026-02-16T12:00:00Z
title: Stop Guessing About Cache Headers - How Browsers Really Handle Caching 
slug: stop-guessing-about-cache-headers
featured: true 
draft: true
tags:
  - caching
  - http
  - browser-cache
  - cache-control
  - browser-internals
description: "Learn how browsers really handle caching and how to use cache headers to your advantage.This article goes through the different cache headers and practically demonstrate with a test server and a client."
---


Browser Caching is one of the most misunderstood parts of web. Many engineers add `Cache-Control: no-cache` to their responses to prevent caching. Some tweak the `max-age` values until they seem fast enough for them. But under the hood, browser caching is not random or magical — it is a deterministic system governed by strict HTTP rules. The objective of this article is to pratically demonstrate how browsers handle caching and how to use cache headers to your advantage.

**Note**: All the demonstrations are done with a express.js server serving static files and api responses. You can find the code [here](https://github.com/alanjames007/cache-headers-demo).

![Caching Diagram](https://blog-cdn.alan-james.com/images/browser-caching/browser-caching-blog-cover.webp)

## What assets are cached?

> browsers can cache almost any HTTP response, as long as the response headers allow it

But in practice, some asset types are cached much more commonly than others.

Let's see each of them

### 1. Static Assets(Almost Always Cached)
- css files: `/style.css`
- javascript files: `/script.js`
- Images: `/image.png`
- Fonts: `/inter.woff2`
- Videos And audio(if cachable headers are present): ideal for long TTLs since they change rarely

### 2. HTML Documents(Sometimes Cached)
HTML pages can be cached, but often:
- they changes frequently
- they are dynamic and contain user-specific data
- they require revalidation

### 3. API Responses(Depends on the headers)
API responses are cached only if allowed.

Example:
```
Cache-Control: max-age=120
```
now the browser will cache the response for 120 seconds.

**Demo**:
See the section: `1. Cached API` in the [demo](https://github.com/alanjames007/cache-headers-demo).

**First request**:
```
Response JSON: {"message":"This can be cached","timestamp":"2026-02-16T14:25:49.925Z"}
```

**Second request - made within 10 seconds TTL**:
```
Response JSON: {"message":"This can be cached","timestamp":"2026-02-16T14:25:49.925Z"}
```
You can see that the response is the same as the first request. This is because the browser cached the response for 10 seconds.

**Third request - made after 10 seconds TTL**:
```
Response JSON: {"message":"This can be cached","timestamp":"2026-02-16T14:26:12.305Z"}
```

You can see that the response is different from the first and second requests. This is because the browser did not find the response in the cache and had to make a new request to the server, since the TTL has expired.

### 4. Other cachable

Browsers may also cache:
- SVG files
- WASM files
- Text files
- PDFs
- Any GET request response

As long as:
- It’s not no-store
- It’s not a non-cacheable method (like POST, unless explicitly allowed)

## Methods matters
By default, the following behaviour can be observed:

| HTTP Method       |  Cached by Browser ? |
|-------------------|------------------------------|
| GET               | Yes [if allowed by headers]|
| HEAD              | Yes|
| POST              | Usually No|
| PUT               |  No|
| DELETE | No


## Where does the browser store the cached assets?

Browser can store the cached assets in three primary places:
- Memory Cache
- Disk Cache
- Service Worker Cache (Cache Storage API)
Each behaves differently.
