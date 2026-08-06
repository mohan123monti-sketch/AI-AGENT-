# Day 1 – Brainstorming & Problem Understanding

## Project Title

**PlanAI – AI-Powered Productivity Platform using Intelligent Agents**

---

## Date

**28 July 2026**

---

# Objective

To understand the project problem statement, identify the scope of AI-powered productivity assistance, brainstorm possible features, and establish the initial direction for system design and implementation.

---

# Problem Statement

Design and develop an **AI-powered productivity platform** that leverages intelligent agents to deliver personalized, context-aware assistance for everyday productivity tasks such as task management, scheduling, reminders, focus improvement, and work planning.

---

# Activities Performed

## 1. Understanding the Problem Statement

The project team analyzed the given problem statement and discussed how Artificial Intelligence can improve users' daily productivity.

The discussion focused on:

- Understanding the role of AI assistants in productivity.
- Identifying common productivity challenges faced by users.
- Differentiating between traditional productivity applications and AI-powered assistants.
- Understanding how intelligent modules can collaborate to improve productivity.

---

## 2. Brainstorming Productivity Features

The team explored different productivity areas that could be integrated into a single platform.

### Core Productivity Modules

- Task Management
- Calendar Management
- Smart Scheduling
- Reminder Management
- Goal Tracking
- Focus Assistant
- Daily Planner
- Productivity Analytics

After discussion, the team decided to focus on building a unified productivity platform that combines these modules into one application.

---

## 3. Identifying Possible AI Features

### Task Management

Possible features include:

- Smart task creation
- Priority-based task recommendations
- Deadline tracking
- Task categorization
- AI task suggestions

---

### Calendar Management

Possible features include:

- Meeting scheduling
- Event management
- Calendar synchronization
- Conflict detection
- Time-slot recommendations

---

### Reminder Service

Possible features include:

- Intelligent reminders
- Deadline notifications
- Recurring reminders
- Context-aware alerts

---

### Focus Assistant

Possible features include:

- Focus session planning
- Break reminders
- Productivity timer
- Distraction reduction suggestions

---

### Goal Tracker

Possible features include:

- Daily goals
- Weekly goals
- Long-term objective tracking
- Progress monitoring
- Productivity reports

---

## 4. Discussion on Intelligent Productivity Modules

The team discussed:

- Which tasks should be automated by AI.
- How productivity modules can share information.
- The benefits of personalized recommendations.
- The importance of reducing the need for multiple productivity applications.

---

## 5. System Design Discussion

The team identified the major architectural components required for the platform.

Initial architecture includes:

- Web and Mobile User Interface
- API Gateway
- Productivity Services
- User Profile Service
- Database Layer
- Authentication Service
- Notification Service
- AI Recommendation Engine

---

## 6. Discussion on AI Models

Different AI models were explored based on:

- Capability
- Performance
- API availability
- Cost
- Scalability

The team considered:

- GPT Models
- Gemini Models
- Claude Models
- Open-source LLMs from Hugging Face

The discussion focused on selecting suitable AI models for task recommendations, scheduling assistance, and productivity insights.

---

## 7. Challenges Identified

The team identified several potential challenges:

- Maintaining personalized recommendations.
- Managing user preferences securely.
- Integrating multiple productivity modules.
- API rate limits and usage costs.
- Ensuring scalability as the number of users increases.
- Protecting user privacy and sensitive productivity data.

---

# Initial Architecture Idea

```text
               Web / Mobile App
                      │
                      ▼
               +---------------+
               | API Gateway   |
               +-------+-------+
                       │
     -----------------------------------------
     │        │         │         │          │
     ▼        ▼         ▼         ▼          ▼
 Task     Calendar   Reminder   Focus     Goal
Service    Service    Service   Service   Tracker
     │        │         │         │          │
     └────────┴─────────┴─────────┴──────────┘
                      │
                      ▼
           User Profile Service
                      │
                      ▼
                 Productivity DB
```

---

# Learning Outcomes

- Understood the project requirements and scope.
- Identified the major productivity features required.
- Learned the role of intelligent modules in productivity applications.
- Recognized the importance of personalization through a shared user profile.
- Understood the need for a scalable microservices architecture.
- Identified technical challenges related to AI integration, scalability, and security.

---

# Conclusion

The first day focused on understanding the problem statement and identifying how AI can improve everyday productivity. The team finalized the core productivity modules, discussed system architecture, explored AI model options, and identified potential implementation challenges. This brainstorming session established the foundation for designing and developing the AI-powered productivity platform.




# Day 2 Sytem Design and Project 

# DT Playbook – Similar Products

## Project

**AI-Powered Consumer Platform with Intelligent Agents**

---

# 1. Similar Products Analysis

## Product 1: ChatGPT

### Purpose
An AI assistant that helps users with conversations, writing, coding, learning, planning, and answering questions.

### What it does well
- Excellent conversational AI
- Understands natural language
- Assists across multiple domains
- Generates personalized responses
- Supports document summarization and coding

### What it misses for our project
- No dedicated Health, Finance, Shopping, or Travel agents working together
- Limited long-term personalization without external memory
- Cannot directly manage user profiles across multiple services
- Does not automatically integrate with multiple third-party APIs for everyday activities

---

## Product 2: Google Gemini

### Purpose
Google's AI assistant integrated with Search, Gmail, Maps, Drive, and other Google services.

### What it does well
- Strong integration with the Google ecosystem
- Real-time information retrieval
- Good productivity assistance
- Calendar and email support
- Context-aware responses

### What it misses for our project
- Primarily focused on Google services
- Limited specialised multi-agent collaboration
- Does not provide a unified platform for Health, Finance, Education, Shopping, and Travel
- Limited support for customised workflows

---

## Product 3: Perplexity AI

### Purpose
An AI-powered search assistant that provides accurate answers with citations.

### What it does well
- Fast web search
- Trusted references
- Excellent research assistance
- Simple and clean interface

### What it misses for our project
- Mainly focused on information retrieval
- No specialised intelligent agents
- No task automation
- Does not maintain detailed user preferences across daily activities

---

# Comparison Table

| Feature | ChatGPT | Google Gemini | Perplexity AI | Our Platform |
|----------|----------|---------------|---------------|--------------|
| Conversational AI | ✅ | ✅ | ✅ | ✅ |
| Health Agent | ❌ | Limited | ❌ | ✅ |
| Finance Agent | ❌ | Limited | ❌ | ✅ |
| Education Agent | ✅ | ✅ | ✅ | ✅ |
| Shopping Agent | Limited | Limited | Limited | ✅ |
| Travel Agent | Limited | ✅ | Limited | ✅ |
| Productivity | ✅ | ✅ | Limited | ✅ |
| Multi-Agent Collaboration | ❌ | ❌ | ❌ | ✅ |
| Personalised User Profile | Limited | Limited | ❌ | ✅ |
| Cross-Domain Intelligence | ❌ | ❌ | ❌ | ✅ |

---

# 2. Why Our Problem is Still Worth Solving

Although powerful AI assistants already exist, users still switch between multiple applications to manage everyday activities.

## Current Solutions

- Focus on one ecosystem or one primary use case
- Limited collaboration between specialised AI agents
- No unified platform covering Health, Finance, Education, Shopping, Travel, and Productivity
- Limited persistent personalisation across different life domains

## Our Solution

- Multiple specialised AI agents
- Shared user profile and preferences
- Personalised recommendations
- Cross-domain collaboration
- One application instead of multiple separate apps

---

# 3. User Profile Service Design

## User Information

| Field | Description |
|--------|-------------|
| Name | User's name |
| Age | User's age |
| Preferred Language | Communication language |
| Location | Current location |
| Occupation | Profession or role |

---

## User Preferences

| Category | Examples |
|-----------|----------|
| Shopping | Favourite categories |
| Travel | Preferred destinations |
| Learning | Subjects of interest |
| Finance | Investment risk level |
| Health | Personal health goals |

---

## Behaviour History

| Data Stored | Purpose |
|-------------|---------|
| Previous Searches | Better recommendations |
| Agent Interactions | Personalised responses |
| Purchase History | Shopping suggestions |
| Travel History | Travel planning |
| Learning Progress | Educational recommendations |

---

## Benefits

- Personalised AI responses
- Faster recommendations
- Better collaboration between agents
- Reduced repeated user input
- Improved user experience

---

# 4. Primary Persona

| Attribute | Details |
|-----------|---------|
| Name | Arjun Kumar |
| Age | 24 |
| Occupation | Software Engineering Student |

## Context

Arjun uses multiple applications every day for studying, shopping, travel planning, budgeting, and health management. Switching between apps wastes time and scatters information.

## Frustration

> "I wish one AI assistant could understand all my preferences instead of me repeating everything in different apps."

## Quote

> "I don't want five different apps when one intelligent platform can do everything."

---

# 5. Empathy Map

| Says | Thinks | Does | Feels |
|------|---------|------|--------|
| "I forget important tasks." | There should be one platform for everything. | Uses ChatGPT for learning. | Frustrated by switching apps. |
| "I use too many apps." | AI should remember my preferences. | Shops online frequently. | Overwhelmed by information. |
| "Recommendations are rarely personalised." | My data should remain private and secure. | Tracks expenses manually. | Happy when recommendations save time. |

---

# 6. Worst Pain Point

## Daily Step

**Planning the day in the morning**

## Problem

The user needs to open multiple applications for:

- Calendar management
- Reminders
- Finance tracking
- Health updates
- Shopping
- Study planning

## Our Solution

A unified AI-powered platform combines all these activities into a single personalised dashboard powered by intelligent AI agents.

---

# Summary

Our platform provides:

- ✅ Multiple AI Agents
- ✅ Shared User Profile
- ✅ Cross-Domain Intelligence
- ✅ Personalised Recommendations
- ✅ Unified Dashboard
- ✅ Seamless Third-Party Integration
- ✅ Better User Experience



# Day 3 System Design and Project Discussion

# DT Playbook – Similar Products

## Problem Statement

**Design and develop an AI-powered consumer platform that leverages intelligent agents to deliver personalized, context-aware services for everyday activities such as health, finance, education, shopping, travel, and productivity.**

---

# Step 1 – Who / What / Where

## Who

The platform is designed for:

- Students
- Working Professionals
- Families
- Senior Citizens
- Online Shoppers
- Travellers
- Investors
- People managing daily tasks

---

## What

An **AI-powered consumer platform** that combines multiple intelligent agents into a single application. These agents collaborate to deliver personalised, context-aware assistance based on user preferences and behaviour.

### Core Intelligent Agents

| Agent | Responsibility |
|--------|----------------|
| 🏥 Health Agent | Health tracking, wellness recommendations, medication reminders |
| 💰 Finance Agent | Budget management, expense tracking, financial insights |
| 📚 Education Agent | Learning assistance, tutoring, study planning |
| 🛒 Shopping Agent | Product recommendations, price comparison, order assistance |
| ✈️ Travel Agent | Trip planning, itinerary creation, travel recommendations |
| 📅 Productivity Agent | Task management, reminders, scheduling, daily planning |

---

## Where

The platform can be accessed through:

- Web Application
- Mobile Application
- Future Desktop Application

### Platform Architecture

- Microservices Architecture
- REST APIs
- Secure Databases
- AI Services
- Cloud Infrastructure

---

# Step 2 – Similar Products

## Product 1 – ChatGPT

### Purpose

General-purpose AI assistant for conversations, learning, coding, writing, and productivity.

### Strengths

- Natural conversations
- Multi-domain knowledge
- Content generation
- Coding assistance
- Personalised responses

### Missing for Our Project

- No dedicated Health, Finance, Shopping, or Travel agents
- Limited persistent user profile
- No shared memory between specialised agents
- Does not provide one unified platform for daily activities

---

## Product 2 – Google Gemini

### Purpose

AI assistant deeply integrated with Google's ecosystem.

### Strengths

- Google Search integration
- Gmail and Calendar support
- Real-time information
- Strong productivity features

### Missing for Our Project

- Primarily focused on Google services
- No specialised consumer agents working together
- Limited personalisation across multiple life domains

---

## Product 3 – Perplexity AI

### Purpose

AI-powered search assistant that provides accurate answers with source citations.

### Strengths

- Accurate search
- Reliable references
- Fast research
- Clean and simple interface

### Missing for Our Project

- Primarily focused on question answering
- No intelligent workflow automation
- No centralised user profile
- No multi-agent collaboration

---

# Similar Products Comparison

| Feature | ChatGPT | Google Gemini | Perplexity AI | Our Platform |
|----------|----------|---------------|---------------|--------------|
| Conversational AI | ✅ | ✅ | ✅ | ✅ |
| Health Agent | ❌ | Limited | ❌ | ✅ |
| Finance Agent | ❌ | Limited | ❌ | ✅ |
| Education Agent | ✅ | ✅ | ✅ | ✅ |
| Shopping Agent | Limited | Limited | Limited | ✅ |
| Travel Agent | Limited | Limited | Limited | ✅ |
| Productivity Tools | ✅ | ✅ | Limited | ✅ |
| Multi-Agent Collaboration | ❌ | ❌ | ❌ | ✅ |
| Shared User Profile | Limited | Limited | ❌ | ✅ |
| Cross-Domain Personalisation | ❌ | ❌ | ❌ | ✅ |

---

# Gap Identified

Existing AI assistants perform individual tasks effectively but require users to switch between multiple applications.

### Current Platforms Lack

- Unified intelligent agents
- Shared user profile
- Cross-agent communication
- Personalised recommendations across multiple domains
- One platform for managing everyday activities

---

# User Profile Service Notes

The **User Profile Service** stores and manages user information to enable personalised experiences across all AI agents.

## Information Stored

| Category | Details |
|----------|---------|
| Personal Information | Name, Age, Occupation |
| Language Preference | Preferred communication language |
| Location | City, State, Country |
| Health Preferences | Health goals, fitness interests |
| Shopping Interests | Favourite categories, brands |
| Learning Goals | Skills and educational interests |
| Investment Preference | Risk level and financial goals |
| Travel Preference | Favourite destinations and travel style |
| Previous Interactions | AI conversations and agent activities |
| Search History | Recent searches and recommendations |

---

# Benefits of User Profile Service

- Personalised recommendations
- Better AI responses
- Faster decision-making
- Reduced repeated user input
- Shared information across all intelligent agents
- Improved collaboration between services
- Consistent user experience across the platform

---

# Key Takeaways

- Unified AI-powered consumer platform
- Multiple specialised intelligent agents
- Shared user profile across all services
- Personalised and context-aware recommendations
- Cross-agent collaboration using microservices
- One application for everyday activities





# Day 4 – User Profile Service

## Today's Lesson

# What is a User Profile Service?

A **User Profile Service** is a dedicated microservice responsible for storing and managing user information, preferences, and activity history. It acts as a **central source of user data**, allowing all AI agents to access a consistent profile and deliver personalized recommendations.

---

# Why is it Needed?

## Without a User Profile Service

- Each microservice stores user information independently.
- User preferences become inconsistent across services.
- Personalization is limited.
- Data duplication increases.
- Updating user information becomes difficult.

## With a User Profile Service

- Centralized user profile management.
- Consistent personalization across all AI agents.
- Easy management of user preferences.
- Reduced data duplication.
- Better scalability and maintainability.
- Improved privacy and security.

---

# User Profile Service in Our Project

In our **AI-Powered Consumer Platform**, the **User Profile Service** acts as the central repository for user information, preferences, and activity history. Every AI domain service—**Health, Finance, Education, Shopping, Travel, and Productivity**—retrieves user data through the **API Gateway** to generate personalized recommendations.

---

# Basic User Profile Fields

## Basic Information

| Field | Description |
|--------|-------------|
| User ID | Unique identifier |
| Full Name | User's name |
| Email Address | Registered email |
| Mobile Number | Contact number |
| Date of Birth | User's birth date |
| Gender | User gender |
| Location | City/State/Country |
| Preferred Language | Language for communication |

---

## Account Information

| Field | Description |
|--------|-------------|
| Username | Login username |
| Password | Encrypted password |
| Profile Picture | User avatar |
| Account Status | Active/Inactive |
| Registration Date | Account creation date |
| Last Login | Most recent login |

---

## General Preferences

| Preference | Description |
|------------|-------------|
| AI Assistant Language | Preferred interaction language |
| Notification Preferences | Email, SMS, Push notifications |
| Theme | Light or Dark mode |
| Time Zone | User's local time zone |

---

# Domain Preferences

## Health

| Field | Description |
|--------|-------------|
| Health Goals | Fitness or wellness goals |
| Allergies | Known allergies |
| Medical Conditions | Optional health conditions |
| Fitness Preferences | Exercise preferences |

---

## Finance

| Field | Description |
|--------|-------------|
| Monthly Budget | Planned monthly expenses |
| Investment Risk Level | Low, Medium, High |
| Savings Goals | Financial objectives |

---

## Education

| Field | Description |
|--------|-------------|
| Learning Interests | Subjects or skills |
| Preferred Learning Style | Video, Reading, Practice |
| Skill Level | Beginner, Intermediate, Advanced |

---

## Shopping

| Field | Description |
|--------|-------------|
| Favourite Categories | Electronics, Fashion, etc. |
| Preferred Brands | Favorite brands |
| Shopping Budget | Planned spending |

---

## Travel

| Field | Description |
|--------|-------------|
| Preferred Destinations | Favorite travel locations |
| Travel Budget | Planned travel expenses |
| Hotel Preferences | Budget, Luxury, Family, etc. |

---

## Productivity

| Field | Description |
|--------|-------------|
| Working Hours | Daily work schedule |
| Reminder Settings | Reminder preferences |
| Calendar Preferences | Scheduling options |

---

# Activity History

| Activity | Description |
|----------|-------------|
| Search History | Previous searches |
| AI Chat History | Past conversations |
| Recently Used Services | Frequently accessed AI agents |
| Recommendation History | Previous AI recommendations |
| Booking History | Travel bookings |
| Purchase History | Shopping transactions |
| Learning Progress | Course and skill progress |

---

# Privacy & Security

| Setting | Description |
|---------|-------------|
| Consent Settings | User consent management |
| Data Sharing Permissions | Control data access between services |
| Two-Factor Authentication | Additional login security |
| Connected Third-Party Accounts | Google, Microsoft, etc. |

---

# User Profile Service Architecture

```text
                    Client
              (Web / Mobile App)
                      │
                      ▼
              +---------------+
              | API Gateway   |
              +-------+-------+
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
+-------------------+     +---------------------------+
| User Profile      |     | AI Domain Services        |
| Service           |     |---------------------------|
|                   |     | • Health                 |
| Stores User Data  |     | • Finance               |
| Preferences       |     | • Education             |
| Activity History  |     | • Shopping              |
| Privacy Settings  |     | • Travel                |
+---------+---------+     | • Productivity          |
          │               +------------+------------+
          └────────────────────────────┘
                       │
                       ▼
             +----------------------+
             | User Profile Database|
             +----------------------+
```

---

# Request Flow

```text
User
  │
  ▼
Web / Mobile Application
  │
  ▼
API Gateway
  │
Authenticate User
  │
  ▼
User Profile Service
  │
Retrieve User Profile
  │
  ▼
Requested AI Service
(Health / Finance / Travel / Shopping / Education / Productivity)
  │
Generate Personalized Recommendation
  │
  ▼
API Gateway
  │
  ▼
User
```

---

# Responsibilities of the User Profile Service

- Store user information securely.
- Maintain user preferences.
- Manage activity history.
- Share profile data with authorized AI services.
- Update profile information.
- Manage privacy and consent settings.
- Enable personalized recommendations across all domains.
- Provide a consistent user experience.

---

# Example Workflow

1. The user logs into the platform.
2. The API Gateway authenticates the user.
3. The User Profile Service retrieves the user's profile and preferences.
4. The requested AI service (e.g., Travel Service) requests the user's profile.
5. The AI service generates personalized recommendations.
6. The response is sent back through the API Gateway.
7. The user's activity is stored for future personalization.

---

# Advantages

- Centralized user management.
- Consistent personalization across all AI services.
- Reduced data duplication.
- Easier maintenance and scalability.
- Better privacy and security.
- Faster recommendation generation.
- Supports future expansion with additional AI agents.
- Improves the overall user experience.

---

# Key Takeaways

- The **User Profile Service** is the foundation of personalization in the platform.
- It stores user information, preferences, activity history, and privacy settings.
- All AI domain services use this shared profile to deliver consistent and personalized recommendations.
- Centralized profile management improves scalability, security, and maintainability in a microservices architecture.



# Day 5 – Data Storage Options in System Design

## Problem Statement

Design and develop an **AI-powered productivity platform** that leverages intelligent agents to deliver personalized, context-aware assistance for everyday productivity tasks such as task management, scheduling, reminders, focus improvement, and work planning.

---

# What is Data Storage?

Data storage is a critical part of **system design** because it determines how data is stored, accessed, and managed.

The choice of storage depends on:

- Scalability
- Performance
- Consistency
- Reliability
- Availability
- Type of data being stored

---

# 1. Relational Databases (SQL)

Relational databases store data in **tables** consisting of rows and columns. They use **Structured Query Language (SQL)** and support relationships between tables.

## Examples

- PostgreSQL
- MySQL
- Microsoft SQL Server
- Oracle Database

### Advantages

- ACID transactions
- Strong consistency
- Supports complex SQL queries
- Data integrity using constraints
- Reliable for transactional systems

### Best Used For

- User accounts
- Task management
- Calendar events
- Reminder services
- Productivity applications
- Banking systems
- E-commerce

---

# 2. NoSQL Databases

NoSQL databases provide flexible schemas and are designed for horizontal scalability.

---

## a) Document Database

Stores data as JSON-like documents.

### Examples

- MongoDB
- CouchDB

### Best Used For

- User profiles
- AI preferences
- Application settings
- Content management

---

## b) Key-Value Database

Stores information as key-value pairs.

### Examples

- Redis
- Amazon DynamoDB

### Best Used For

- User sessions
- Authentication tokens
- API caching
- User preferences

---

## c) Column-Family Database

Stores information by columns instead of rows.

### Examples

- Apache Cassandra
- Apache HBase

### Best Used For

- Large-scale analytics
- Event logging
- IoT applications

---

## d) Graph Database

Stores data using nodes and relationships.

### Examples

- Neo4j
- Amazon Neptune

### Best Used For

- Recommendation systems
- Knowledge graphs
- Social networks

---

# 3. Object Storage

Object storage is used to store files and binary objects.

### Examples

- Amazon S3
- Google Cloud Storage
- Azure Blob Storage

### Stores

- Images
- Documents
- PDFs
- Videos
- Backups

---

# 4. File Storage

Stores files using a hierarchical file system.

### Examples

- Local File System
- Network Attached Storage (NAS)

### Best Used For

- Small applications
- Shared documents
- Local backups

---

# 5. Data Warehouse

A Data Warehouse stores historical data for reporting and business analytics.

### Examples

- Snowflake
- Google BigQuery
- Amazon Redshift

### Best Used For

- Dashboards
- Business Intelligence
- Historical reports
- Productivity analytics

---

# 6. Cache Storage

Cache stores frequently accessed data in memory to improve application performance.

### Examples

- Redis
- Memcached

### Best Used For

- User sessions
- Frequently accessed user data
- API responses
- Authentication

---

# Data Storage Comparison

| Storage Type | Examples | Best Used For |
|--------------|----------|---------------|
| Relational Database | PostgreSQL, MySQL | Structured business data |
| Document Database | MongoDB | User profiles, JSON documents |
| Key-Value Store | Redis, DynamoDB | Sessions, caching, preferences |
| Column-Family Database | Cassandra | Big data and analytics |
| Graph Database | Neo4j | Relationship-based data |
| Object Storage | Amazon S3 | Images, documents, videos |
| Data Warehouse | Snowflake, BigQuery | Reporting and analytics |
| Cache Storage | Redis, Memcached | High-speed data access |

---

# Data Storage for Our AI Productivity Platform

| Component | Recommended Storage |
|-----------|---------------------|
| User Accounts | PostgreSQL / MySQL |
| User Profile | MongoDB or PostgreSQL |
| Tasks | PostgreSQL |
| Calendar Events | PostgreSQL |
| Reminders | PostgreSQL |
| Productivity Analytics | Data Warehouse |
| User Sessions | Redis |
| Uploaded Documents | Object Storage (Amazon S3 or equivalent) |
| Application Logs | Elasticsearch / Log Management System |

---

# Storage Architecture

```text
                    Client
                       │
                       ▼
                 API Gateway
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
+--------------+ +--------------+ +----------------+
| User Service | | Task Service | | Reminder       |
|              | |              | | Service        |
+------+-------+ +------+-------+ +-------+--------+
       │                │                 │
       └────────┬───────┴────────┬────────┘
                ▼                ▼
        +-------------------------------+
        | Relational Database           |
        | (Users, Tasks, Reminders)     |
        +---------------+---------------+
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
+-------------------+        +----------------------+
| Redis Cache       |        | MongoDB              |
| Sessions & Cache  |        | User Profiles        |
+-------------------+        +----------------------+
         │
         ▼
+------------------------------+
| Object Storage               |
| Images, PDFs, Documents      |
+------------------------------+
```

---

# Why These Storage Choices?

| Data | Storage Choice | Reason |
|------|----------------|--------|
| User Accounts | PostgreSQL | Secure and transactional |
| Tasks | PostgreSQL | Strong consistency |
| Calendar | PostgreSQL | Structured scheduling data |
| User Profiles | MongoDB | Flexible user preferences |
| Sessions | Redis | Fast in-memory access |
| Uploaded Files | Object Storage | Efficient file management |
| Analytics | Data Warehouse | Large-scale reporting |

---

# Advantages

- Reliable transactional data management
- Fast application performance using cache
- Flexible user profile storage
- Scalable architecture
- Secure document storage
- Better reporting and analytics
- Easy future expansion

---

# Key Takeaways

- Different types of data require different storage solutions.
- Relational databases are ideal for structured transactional data.
- MongoDB provides flexibility for storing user profiles and preferences.
- Redis improves performance through in-memory caching.
- Object Storage efficiently stores files and documents.
- Data Warehouses support reporting and business analytics.
- Combining multiple storage technologies results in a scalable and efficient AI-powered productivity platform.



# Day 6 – System Design Report

## Topic

**Scalability, API Design, Authentication, and Security**

---

# Introduction

Modern software applications must support a growing number of users while maintaining high performance, reliability, scalability, and security. **System Design** provides the architectural foundation to build applications that can efficiently handle increasing workloads and deliver a seamless user experience.

This report covers essential system design concepts including **server architecture, databases, scaling techniques, load balancing, health checks, API design, authentication, authorization, and security**, along with their application in an AI-powered productivity platform.

---

# Single Server Setup

A **Single Server Setup** is the simplest software architecture where a single server handles:

- Client requests
- Business logic
- Database communication
- Authentication

### Advantages

- Easy to develop
- Low deployment cost
- Suitable for small applications

### Limitations

- Limited scalability
- Single Point of Failure (SPOF)
- Performance decreases as users increase
- Difficult to maintain under heavy traffic

---

# Databases

Choosing the right database depends on the type of data and application requirements.

## SQL Databases

SQL databases store structured data in tables with predefined schemas.

### Examples

- PostgreSQL
- MySQL
- Microsoft SQL Server

### Best For

- User accounts
- Task management
- Calendar events
- Reminder systems

### Advantages

- Strong consistency
- ACID transactions
- Complex queries
- High data integrity

---

## NoSQL Databases

NoSQL databases provide flexible schemas and support large-scale distributed applications.

### Examples

- MongoDB
- Cassandra
- Redis

### Best For

- User profiles
- Preferences
- Session storage
- Analytics

---

## Graph Databases

Graph databases store information as nodes and relationships.

### Examples

- Neo4j
- Amazon Neptune

### Best For

- Recommendation systems
- Relationship-based applications
- Knowledge graphs

---

# Vertical vs Horizontal Scaling

## Vertical Scaling

Vertical scaling increases the hardware resources of an existing server.

### Advantages

- Simple implementation
- No application redesign

### Limitations

- Hardware limits
- Expensive upgrades
- Downtime during upgrades

---

## Horizontal Scaling

Horizontal scaling adds multiple servers to share the workload.

### Advantages

- Better scalability
- High availability
- Fault tolerance
- Supports cloud deployment

### Limitations

- More complex architecture
- Requires load balancing

---

# Load Balancing

A **Load Balancer** distributes incoming requests across multiple servers.

### Benefits

- Prevents server overload
- Improves performance
- Increases availability
- Supports horizontal scaling
- Provides fault tolerance

---

# Health Checks

Health checks continuously monitor application servers and services.

### Purpose

- Detect unhealthy servers
- Remove failed instances from service
- Redirect traffic to healthy servers
- Improve reliability

---

# Single Point of Failure (SPOF)

A **Single Point of Failure (SPOF)** is any component whose failure causes the entire application to stop working.

### Solutions

- Multiple application servers
- Database replication
- Backup systems
- Load balancers
- Automatic failover

---

# API Design

An **Application Programming Interface (API)** enables communication between clients and backend services.

### Good API Characteristics

- Simple
- Consistent
- Secure
- Scalable
- Easy to maintain

---

# API Protocols

## REST

REST (Representational State Transfer) is the most widely used API architecture.

### Features

- Lightweight
- Stateless
- Uses HTTP methods
- Easy integration

---

## GraphQL

GraphQL allows clients to request only the data they require.

### Advantages

- Reduces unnecessary data transfer
- Single endpoint
- Flexible queries
- Better performance for complex applications

---

# Transport Layer Protocols

## TCP (Transmission Control Protocol)

### Features

- Reliable communication
- Ordered delivery
- Error checking
- Connection-oriented

### Used For

- Web applications
- Banking
- Email
- APIs

---

## UDP (User Datagram Protocol)

### Features

- Faster communication
- No guaranteed delivery
- Low latency

### Used For

- Video streaming
- Online gaming
- Voice calls
- Live broadcasts

---

# RESTful APIs

RESTful APIs use standard HTTP methods.

| Method | Purpose |
|---------|----------|
| GET | Retrieve data |
| POST | Create new data |
| PUT | Update existing data |
| DELETE | Remove data |

### Advantages

- Stateless
- Scalable
- Easy to implement
- Platform independent

---

# GraphQL

GraphQL is a query language for APIs.

### Benefits

- Fetch only required data
- Reduces bandwidth usage
- Single endpoint
- Flexible client queries

---

# Authentication

Authentication verifies the identity of a user before allowing access.

### Common Methods

- Username and Password
- JSON Web Token (JWT)
- OAuth 2.0
- Multi-Factor Authentication (MFA)

---

# Authorization

Authorization determines what an authenticated user is allowed to access.

### Example

| User Role | Permissions |
|-----------|-------------|
| Administrator | Full system access |
| User | Access personal data only |
| Guest | Limited access |

> **Authentication** answers **"Who are you?"**  
> **Authorization** answers **"What are you allowed to do?"**

---

# Security

Security protects applications from unauthorized access and cyber threats.

### Best Practices

- HTTPS encryption
- Password hashing
- JWT authentication
- Role-Based Access Control (RBAC)
- Input validation
- Secure API communication
- Regular security monitoring
- Data encryption

---

# System Design for Our AI-Powered Productivity Platform

The platform follows a **Microservices Architecture** where each productivity feature operates as an independent service.

## Core Services

- User Profile Service
- Task Management Service
- Calendar Management Service
- Reminder Service
- Focus Assistant
- Goal Tracker

---

# High-Level Architecture

```text
                    Client
              (Web / Mobile App)
                       │
                       ▼
                +---------------+
                | API Gateway   |
                +-------+-------+
                        │
      ------------------------------------------------
      │         │          │          │              │
      ▼         ▼          ▼          ▼              ▼
+-----------+ +-----------+ +-----------+ +-----------+ +----------------+
| User      | | Task      | | Calendar  | | Reminder  | | Focus & Goal   |
| Profile   | | Service   | | Service   | | Service   | | Service         |
+-----+-----+ +-----+-----+ +-----+-----+ +-----+-----+ +--------+--------+
      │             │             │             │                │
      └─────────────┴─────────────┴─────────────┴────────────────┘
                            │
                            ▼
                    +----------------+
                    | PostgreSQL DB  |
                    +----------------+
                            │
                            ▼
                    +----------------+
                    | Redis Cache    |
                    +----------------+
```

---

# Scalability Strategy

The platform supports future growth using:

- Horizontal Scaling
- Load Balancers
- Health Checks
- Independent Microservices
- Redis Caching
- Stateless REST APIs

---

# Security Strategy

The platform secures user data through:

- JWT-based authentication
- HTTPS communication
- Password hashing
- Role-Based Access Control (RBAC)
- Input validation
- Secure API Gateway
- Encrypted user information

---

# Key Takeaways

- System design ensures applications remain scalable, reliable, and secure.
- Horizontal scaling and load balancing improve performance for growing applications.
- REST APIs and GraphQL enable efficient communication between clients and backend services.
- Authentication and authorization protect user accounts and resources.
- Security practices such as HTTPS, JWT, RBAC, and encryption safeguard sensitive information.
- A microservices architecture allows the AI-powered productivity platform to scale efficiently while providing reliable and personalized productivity assistance.




# Day 7 – Basics of System Design Concepts

## Problem Statement

Design and develop an **AI-powered productivity platform** that leverages intelligent agents to deliver personalized, context-aware assistance for everyday productivity tasks such as task management, scheduling, reminders, focus improvement, and work planning.

---

# Introduction

**System Design** is the process of planning and organizing the architecture of a software application before development. It helps developers build systems that are **scalable, reliable, secure, and easy to maintain**. A well-designed system can efficiently support increasing users, data, and requests without affecting performance.

---

# 1. Scalability

**Scalability** is the ability of a system to handle increasing numbers of users or requests by adding resources.

## Types of Scaling

### Vertical Scaling

- Increases the CPU, RAM, or storage of a single server.
- Simple to implement.
- Limited by hardware capacity.

### Horizontal Scaling

- Adds multiple servers to distribute the workload.
- Provides better scalability and fault tolerance.
- Commonly used in cloud-based applications.

### Example

As more users use the productivity platform, additional application servers are added to handle the increased traffic.

---

# 2. Availability

**Availability** is the ability of a system to remain operational and accessible whenever users need it.

## Achieved Through

- Redundant servers
- Load balancing
- Backup systems
- Automatic failover

### Example

If one application server fails, another server continues serving user requests without interruption.

---

# 3. Reliability

**Reliability** ensures that a system consistently performs its intended functions without unexpected failures.

### Characteristics

- Consistent performance
- Accurate responses
- Minimal downtime
- Stable operation

---

# 4. Performance

**Performance** measures how quickly a system responds to user requests.

## Important Metrics

| Metric | Description |
|--------|-------------|
| Response Time | Time taken to process a request |
| Throughput | Number of requests processed per second |
| Latency | Delay before receiving a response |

Improving performance results in a better user experience.

---

# 5. Fault Tolerance

**Fault Tolerance** is the ability of a system to continue operating even when one or more components fail.

## Achieved Through

- Redundant servers
- Database replication
- Automatic failover
- Backup infrastructure

---

# 6. Load Balancing

A **Load Balancer** distributes incoming requests across multiple servers.

## Benefits

- Prevents server overload
- Improves application performance
- Increases availability
- Supports horizontal scaling
- Improves fault tolerance

---

# 7. Caching

**Caching** stores frequently accessed data in memory, reducing repeated database queries and improving response times.

### Example

Frequently accessed user profiles, task lists, or calendar information can be stored in a cache for faster retrieval.

## Benefits

- Faster responses
- Reduced database load
- Better application performance

---

# 8. Database Selection

Choosing the appropriate database depends on the type of data being stored.

| Database Type | Best Used For |
|--------------|---------------|
| SQL Database | Structured and transactional data |
| NoSQL Database | Flexible and scalable data storage |

### Example

- **PostgreSQL** stores users, tasks, reminders, and calendar events.
- **MongoDB** stores flexible user preferences and productivity settings.

---

# 9. Security

Security protects user information and system resources from unauthorized access.

## Common Security Practices

- HTTPS
- JWT Authentication
- Password Hashing
- Input Validation
- Role-Based Access Control (RBAC)

### Benefits

- Protects sensitive data
- Prevents unauthorized access
- Ensures secure communication

---

# 10. Monitoring

**Monitoring** continuously tracks system health and performance.

## Common Metrics

| Metric | Purpose |
|--------|----------|
| CPU Usage | Monitor processor utilization |
| Memory Usage | Track RAM consumption |
| Response Time | Measure application speed |
| Error Rate | Detect application failures |

Monitoring helps identify problems before they affect users.

---

# Application to Our AI-Powered Productivity Platform

Our **PlanAI** productivity platform applies these system design concepts to deliver a scalable, secure, and reliable experience.

### Technologies and Design Choices

| Component | Implementation |
|-----------|----------------|
| Architecture | Microservices |
| Scaling | Horizontal Scaling |
| Traffic Management | Load Balancer |
| Authentication | JWT |
| Database | PostgreSQL and MongoDB |
| Caching | Redis |
| Monitoring | Performance and health monitoring tools |

---

# High-Level System Architecture

```text
                    Client
              (Web / Mobile App)
                       │
                       ▼
                +---------------+
                | API Gateway   |
                +-------+-------+
                        │
                Load Balancer
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
+---------------+ +---------------+ +---------------+
| Task Service  | | Calendar      | | Reminder      |
|               | | Service       | | Service       |
+-------+-------+ +-------+-------+ +-------+-------+
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                +----------------------+
                | User Profile Service |
                +----------+-----------+
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   PostgreSQL         MongoDB          Redis Cache
```

---

# Benefits

- Supports thousands of users through horizontal scaling
- Provides high availability using load balancing
- Improves performance with caching
- Protects user data through secure authentication
- Simplifies maintenance using microservices
- Enables future feature expansion

---

# Key Takeaways

- System Design focuses on building scalable, secure, reliable, and maintainable applications.
- Horizontal scaling enables the platform to support increasing numbers of users.
- Load balancing distributes traffic and improves availability.
- Caching reduces response time and improves application performance.
- SQL and NoSQL databases are selected based on the type of data being stored.
- Security mechanisms such as HTTPS, JWT, password hashing, and RBAC protect user data.
- Monitoring helps maintain system health and quickly identify performance issues.
- Together, these concepts provide a strong architectural foundation for the AI-powered productivity platform.


# Day 8 – DT Playbook & System Design

## Project

**PlanAI – AI-Powered Productivity Platform**

---

# Problem Statement

Design and develop an **AI-powered productivity platform** that leverages intelligent agents to deliver personalized, context-aware services for managing daily tasks, emails, meetings, notes, and reminders.

---

# Part A – DT Playbook

## Today's Focus

Design a process flow that demonstrates how users interact with the platform and how AI agents process productivity requests.

---

# Process Flow

```text
                    User
                     │
                     ▼
        User Login / Registration
                     │
                     ▼
          User Profile Service
   (Stores User Information & Preferences)
                     │
                     ▼
                API Gateway
                     │
                     ▼
        Select Productivity Feature
                     │
     ┌──────────┬──────────┬──────────┬──────────┬──────────┐
     ▼          ▼          ▼          ▼          ▼
 Email      Task      Meeting      Notes    Reminder
Assistant  Assistant  Assistant   Assistant Assistant
     │          │          │          │          │
     └──────────┴──────────┴──────────┴──────────┘
                     │
                     ▼
        AI Agent Processes Request
                     │
                     ▼
     Retrieve / Update Data (MongoDB)
                     │
                     ▼
      Generate Personalized Response
                     │
                     ▼
                 Return Result
                     │
                     ▼
                    User
```

---

# Where Users Lose the Most Time

Users spend significant time switching between multiple productivity applications to:

- Organize emails
- Manage tasks
- Schedule meetings
- Take notes
- Set reminders

This constant context switching reduces efficiency and increases the chances of missing important deadlines.

---

# Leverage Point

A centralized AI-powered productivity assistant can:

- Automatically organize tasks
- Summarize emails
- Schedule meetings
- Manage notes
- Send intelligent reminders
- Provide personalized productivity recommendations

This reduces manual effort and improves productivity through a single unified platform.

---

# Part B – System Design

## Topic

**Error Handling in APIs**

---

# Introduction

**Error handling** is the process of detecting, managing, and responding to errors that occur while processing API requests.

Proper error handling improves application reliability, simplifies debugging, and ensures users receive meaningful feedback when something goes wrong.

---

# Why Error Handling is Important

- Prevents application crashes
- Improves user experience
- Provides meaningful error messages
- Simplifies debugging
- Protects sensitive system information
- Ensures consistent API responses

---

# Common HTTP Status Codes

| HTTP Status Code | Description |
|-----------------|-------------|
| **200 OK** | Request completed successfully |
| **201 Created** | Resource created successfully |
| **400 Bad Request** | Invalid request data or missing parameters |
| **401 Unauthorized** | Authentication required or invalid token |
| **403 Forbidden** | User does not have permission |
| **404 Not Found** | Requested resource does not exist |
| **409 Conflict** | Duplicate resource or conflicting request |
| **422 Unprocessable Entity** | Validation failed |
| **500 Internal Server Error** | Unexpected server-side error |
| **503 Service Unavailable** | Service temporarily unavailable |

---

# Standard API Error Response

A consistent JSON response makes it easier for frontend applications to handle errors.

```json
{
  "success": false,
  "status": 404,
  "error": "Task Not Found",
  "message": "The requested task does not exist.",
  "timestamp": "2026-08-06T10:30:00Z"
}
```

---

# Error Handling in PlanAI

Every request first passes through the **API Gateway** before reaching the appropriate productivity service.

If an error occurs, the backend returns a structured response with an appropriate HTTP status code and descriptive message.

### Examples

| Scenario | Status Code |
|----------|-------------|
| Invalid login credentials | **401 Unauthorized** |
| Requested task not found | **404 Not Found** |
| Invalid task details | **400 Bad Request** |
| Database connection failure | **500 Internal Server Error** |
| AI service temporarily unavailable | **503 Service Unavailable** |

---

# API Error Flow

```text
                User Request
                     │
                     ▼
               API Gateway
                     │
          Validate Request
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Request Valid?              Invalid Request
        │                         │
       Yes                        ▼
        │                 Return Error Response
        ▼                 (400 / 401 / 404 / 500)
Productivity Service
        │
        ▼
 Process Business Logic
        │
        ▼
 Database / AI Service
        │
        ▼
 Generate Response
        │
        ▼
 Return Success Response
```

---

# Best Practices

- Use meaningful HTTP status codes.
- Return consistent JSON error responses.
- Validate all user inputs.
- Log server-side errors for troubleshooting.
- Avoid exposing sensitive system information.
- Implement centralized error-handling middleware.
- Provide user-friendly error messages.

---

# Application to PlanAI

The **API Gateway** and backend services use centralized error handling to ensure users receive clear and consistent responses whenever an error occurs.

This approach improves:

- Reliability
- Security
- Maintainability
- Debugging
- User experience

It is applied across all productivity modules, including:

- Email Assistant
- Task Assistant
- Meeting Assistant
- Notes Assistant
- Reminder Assistant

---

# Key Takeaways

- Error handling makes APIs reliable and user-friendly.
- HTTP status codes clearly indicate different types of errors.
- Consistent JSON responses simplify frontend integration.
- Validation and logging improve debugging and maintenance.
- Centralized error handling improves scalability and reliability.
- Effective API error handling is essential for building a robust AI-powered productivity platform.
