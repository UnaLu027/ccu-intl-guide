# CCU International Student Friendly Campus Guide

A bilingual, service-oriented and task-oriented campus guidance system for international students at National Chung Cheng University.

This project helps international students search for the right administrative office, department, or campus service based on their actual needs. Instead of requiring users to know the exact office name in advance, the system allows them to search by keywords, browse by service category, and follow task-based guidance.

> 國立中正大學國際生友善校園導引系統  
> 以「服務導向」與「任務導向」為核心，協助國際學生從實際需求出發，找到正確的校內單位、服務內容與位置資訊。

---

## Project Overview

International students often face difficulties when trying to solve campus-related administrative problems, such as registration, student ID replacement, dormitory issues, visa / ARC matters, course selection, health services, or finding the correct department office.

This project aims to reduce information-fragmentation problems by providing:

- A bilingual interface in English and Chinese
- Search by student need or keyword
- Service category filtering
- Step-by-step task guidance
- Administrative office and department information
- Campus map and location guidance
- MCP server support for future CCUGPT / AI assistant integration

---

## Core Features

### 1. Search by Need

Users can type what they need, such as:

- `student ID`
- `dormitory`
- `registration`
- `ARC`
- `transcript`
- `course selection`
- `health center`

The system will return related offices, departments, and tasks.

---

### 2. Browse by Service Category

Users can browse campus services by category, including:

- Registration
- Student ID
- International Support
- Department Offices
- Dormitory
- Health
- Library
- Student Affairs
- Academic Affairs
- Course Issues
- Tuition & Fees
- Career Development
- IT Support
- Counseling

---

### 3. Task-Based Guidance

The system provides common task guides with clear steps, such as:

- Replacing a student ID card
- Applying for dormitory-related services
- Handling registration or transcript issues
- Finding the correct office for course-related problems
- Locating administrative or department offices

Each task connects the user to the relevant office or department.

---

### 4. Office and Department Navigation

Each office / department page includes:

- Chinese and English name
- Service description
- Common use scenarios
- Building and floor information
- Indoor location notes
- Office hours
- Phone and email
- Official website link
- Google Maps link
- Related tasks

Some data entries include a manual review flag to remind maintainers that the information may need further verification.

---

### 5. Campus Map Integration

The frontend integrates Google Maps to display campus locations and markers.

Users can view location-based guidance for offices and departments through the navigation pages.

---

### 6. Bilingual Interface

The project supports both English and Chinese through a language context system.

This design helps international students understand campus services while still preserving Chinese office names and official terminology.

---

### 7. MCP / CCUGPT Integration Support

The backend includes an MCP server endpoint designed for future integration with CCUGPT or other AI assistants.

Current MCP tools include:

- `search_campus_service`  
  Search campus services, offices, departments, and tasks by keyword or student need.

- `get_office_info`  
  Get detailed information about a specific administrative office.

- `get_task_guide`  
  Get step-by-step guidance for common student tasks.

- `list_service_categories`  
  List all available campus service categories.

The frontend also includes a floating CCUGPT widget placeholder. Once the actual CCUGPT embed code is available, it can be connected to the existing widget structure.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Wouter
- Lucide React
- Radix UI
- Google Maps JavaScript API

### Backend

- Node.js
- Express
- TypeScript
- MCP SDK

### Package Manager

- pnpm

---

## Project Structure

```txt
ccu-intl-guide/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── CCUGPTWidget.tsx
│       │   ├── Header.tsx
│       │   ├── Map.tsx
│       │   └── ResultCard.tsx
│       ├── contexts/
│       │   ├── LanguageContext.tsx
│       │   └── ThemeContext.tsx
│       ├── data/
│       │   └── campusData.ts
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── SearchResults.tsx
│       │   ├── CategoryResults.tsx
│       │   ├── CampusMap.tsx
│       │   ├── Departments.tsx
│       │   ├── Offices.tsx
│       │   ├── Tasks.tsx
│       │   └── Navigation.tsx
│       ├── App.tsx
│       └── main.tsx
├── server/
│   └── index.ts
├── shared/
│   ├── campusData.ts
│   └── const.ts
├── ideas.md
├── package.json
├── vite.config.ts
└── tsconfig.json
