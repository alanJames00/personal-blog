---
author: Alan James
pubDatetime: 2026-01-29T12:00:00Z
title: PDF Generation at Scale - Replacing Puppeteer with Typst + Go
slug: replacing-puppeteer-with-typst
featured: true 
draft: false
tags:
  - typst
  - go
  - pdf-generation
  - puppeteer
  - scalability
description: "Learn how to replace Puppeteer with Typst + Go for PDF generation at scale. We'll explore the benefits of using Typst for PDF generation, the challenges we faced, and the solutions we implemented."
---

## What's wrong with Puppeteer?

All of us here have probably used Puppeteer for PDF generation at some point, whether for personal projects or for work. Once we start using it, it quickly becomes the default choice for PDF generation and never thinking about alternatives, atleast not until we start facing the issues that come with it.

Puppeeter is essentially a headless browser that can be used to navigate websites and take screenshots or generate PDFs. It's a great tool for scraping, automation and testing. Here are some of the issues we faced with Puppeteer in scale:

#### 1. Chromium Startup Cost
Every puppeeter instance depends on a full chromium process, and chromium has non-trivial startup and initialization costs. This means:
- Cold starts are slow, especially in containerized or serverless environments.
- Scale up during traffic spikes causes noticeable latency spikes.

This overhead is acceptable for UI testing or scraping, but not ideal for a service whose only job is to produce PDFs.
#### 2. Per Request Memory Spikes

Chromium is a general purpose browser, not a lightweight rendering engine

For each PDF request:
- A page context is created and initialized.
- Layouts, fonts, images, CSS and etc are loaded and rendered.
- Peak memory usage is often much higher than the actual PDF size.

The average memory usage may look reasonable, but the spikes are what causes problems. This forced our team to over-provision just to say safe, as did most of other teams using Puppeteer in scale.

#### 3. Painful concurrency 

Running multiple PDF generation jobs in parallel is where this gets unpredicatable and tricky

Common challenges:
- Shared browser instance become contention point.
- Isolated browser instance mulitply memory usage.
- Fine-tuning max concurrency is a balancing act.

So as concurrency increases, system becomes less predictable.
#### 4. Infra costs

- Pods or VMs need large memory limits to avoid OOM kills.
- Horizontal scaling is constrained by RAM rather than CPU.
- Autoscaling is slower since new instances take time to start up.

**None of these are blockers, they are taxes that keep increasing as volume grows.**