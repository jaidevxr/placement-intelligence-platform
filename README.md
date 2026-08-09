# Placement Intelligence Hub

BUILD A MASSIVE UNIVERSAL COMPANY-WISE PLACEMENT INTELLIGENCE PLATFORM FROM SCRATCH

CORE OBJECTIVE

Build a complete placement preparation platform from scratch.

This is NOT a BBD platform.

This is NOT merely an aptitude website.

This is NOT merely a LeetCode clone.

This is a:

UNIVERSAL COMPANY-WISE PLACEMENT QUESTION + PREPARATION + INTELLIGENCE PLATFORM

The primary objective is to create the largest and most comprehensive structured placement-preparation knowledge base possible from publicly discoverable datasets, repositories, question collections, interview experiences, placement resources, company-wise coding lists, PYQ collections, and other available sources.

The platform should support students preparing for:

campus placements

off-campus placements

internships

software engineering roles

technical roles

analyst roles

product companies

service companies

startups

consulting

fintech

banking

core engineering

IT companies

VERY IMPORTANT

DO NOT build the platform around a tiny manually-created question database.

The architecture must be designed around:

MASSIVE DATA INGESTION
+
COMPANY-WISE QUESTION INTELLIGENCE
+
COLLEGE-WISE QUESTION INTELLIGENCE
+
YEAR-WISE QUESTION INTELLIGENCE
+
ROUND-WISE QUESTION INTELLIGENCE
+
CODING COMPANY TAGS
+
PYQs
+
INTERVIEW EXPERIENCES
+
CURRENT-YEAR DATA


The database should be capable of scaling to hundreds of thousands or millions of records.

1. DATA-FIRST ARCHITECTURE

The most important part of this project is the data architecture.

Build the system so that data can continuously come from:

GitHub repositories
Public datasets
Placement preparation repositories
Company-wise coding repositories
Company-wise interview repositories
Placement sheets
Public interview experiences
Public question banks
College placement reports
Candidate-submitted questions
Admin imports
Structured CSV/JSON/Markdown data


The platform should NOT depend on manually entering every question.

2. GITHUB SHOULD BE A MAJOR DATA DISCOVERY SOURCE

Create a dedicated:

GITHUB DATA DISCOVERY ENGINE

The system should be capable of discovering repositories related to:

placement preparation
placement questions
company wise interview questions
company wise coding questions
company wise aptitude questions
company wise PYQ
campus placement
online assessment
OA questions
coding interview questions
technical interview questions
interview experiences
placement sheets
company interview sheets
DSA company questions
LeetCode company questions
company tagged LeetCode problems


Do not search only once.

The architecture must support repeated discovery and refresh.

3. SEARCH COMPANY BY COMPANY

The discovery engine should search individual companies.

Examples:

TCS placement
TCS NQT
TCS coding
TCS interview
TCS PYQ

Infosys placement
Infosys coding
Infosys interview

Accenture placement
Accenture OA
Accenture coding
Accenture interview

Cognizant placement
Cognizant GenC
Cognizant coding
Cognizant interview

Wipro placement
Wipro coding
Wipro interview

Capgemini placement
Capgemini coding

HCLTech placement
HCLTech coding

Tech Mahindra placement

Deloitte placement

IBM placement

LTIMindtree placement

Persistent placement

Mphasis placement

Hexaware placement

Oracle interview
Oracle coding

Amazon interview
Amazon coding
Amazon OA

Microsoft interview
Microsoft coding
Microsoft OA

Google interview
Google coding

Adobe interview
Adobe coding

Cisco interview

JPMorgan interview
JPMorgan coding
JPMorgan OA

Goldman Sachs interview
Goldman Sachs coding

Walmart interview
Walmart coding

Salesforce interview
Salesforce coding


But this list is ONLY a starting point.

The system must discover additional companies automatically.

4. COMPANY DISCOVERY SHOULD NOT BE LIMITED

Build company discovery from:

GitHub
Public company lists
Placement repositories
College placement reports
Candidate reports
Public interview resources
Admin input


When a previously unknown company appears repeatedly, allow it to be added to the company database.

5. COMPANY-WISE CODING DATABASE

This is one of the most important modules.

Create:

COMPANY-WISE CODING INTELLIGENCE

Every coding problem should support multiple company tags.

Example:

Problem:
Two Sum

Companies:
Amazon
Google
Microsoft
Adobe
Uber

Topics:
Array
Hash Map

Difficulty:
Easy

Sources:
Source A
Source B
Source C


Do NOT duplicate the same coding problem for every company.

Use:

coding_problem
        ↓
problem_company
        ↓
company


6. COMPANY FREQUENCY

Store frequency information.

For example:

Company:
Amazon

Problem:
Two Sum

Reports:
27

Sources:
8

Years:
2021
2022
2023
2024
2025
2026


The frontend can then display:

Frequently reported
Recently reported
Company tagged
Multiple sources


7. COMPANY-TAGGED CODING DATA

Search for repositories containing concepts such as:

LeetCode company-wise
LeetCode company tagged
company tagged problems
company frequency
company interview questions
company coding sheet
company OA questions
company DSA sheet


If the repository contains large structured company/problem mappings, build an importer capable of understanding:

company
problem
problem ID
URL
frequency
topic
difficulty
year


where available.

8. DO NOT HARD-CODE A FIXED COMPANY LIST

Database design:

companies
company_aliases


rather than:

if company == TCS
if company == Amazon
if company == Microsoft


New companies should be addable without changing application code.

9. UNIVERSAL QUESTION MODEL

Create one universal question entity.

QUESTION

id
title
question_text
question_type
category
topic
subtopic
difficulty

company
college
year
session
role
round

source
source_url
source_type

verification_status
confidence

created_at
updated_at


But company/college/year relationships should support MANY-TO-MANY relationships.

10. QUESTION TYPES

Support:

MCQ
Multiple Select
Numerical
True/False
Output Prediction
Debugging
Coding
SQL
Interview Question
Subjective
Case Study
Communication


11. PYQ DATABASE

Create a dedicated:

PREVIOUS YEAR QUESTION DATABASE

Filters:

Company
College
Year
Role
Round
Topic
Difficulty
Question Type
Source


Examples:

TCS → 2025 → Aptitude
TCS → 2025 → Coding
Accenture → 2025 → OA
Amazon → 2024 → Coding
Microsoft → 2023 → Technical


12. CURRENT-YEAR DATABASE

Create a first-class:

2026 QUESTIONS

system.

It should support:

Company
College
Date
Role
Round
Question
Source
Verification


Do NOT mix 2026 with historical data.

13. CURRENT SESSION

The system should support:

2026
2026-27
current placement season


without hardcoding a particular year forever.

Next year it should become:

2027
2027-28


without rebuilding the application.

14. COLLEGE-WISE INTELLIGENCE

College is another dimension.

A question may be:

Company:
TCS

College:
BBD University

Year:
2026

Round:
Coding


The same company can have:

TCS
 ├── BBD
 ├── VIT
 ├── SRM
 ├── NIT
 ├── IIT
 └── Other Colleges


15. CROSS-COLLEGE QUESTION ANALYSIS

Allow:

What did TCS ask at other colleges?

Display:

BBD
VIT
SRM
KIIT
Manipal
NITs
IITs
etc.


ONLY where actual data exists.

16. BBD IS ONE SPECIAL SECTION

BBD should NOT be the platform's main architecture.

Create:

BBD PLACEMENT INTELLIGENCE

as a special college section.

Navigation:

Companies
Questions
PYQs
Coding
Aptitude
Technical
Interviews
Mocks
Analytics

--------------------

BBD Placements


17. BBD SECTION

BBD should show:

Companies that visited BBD
Current placement session
2025
Previous years
BBD-specific questions
BBD coding questions
BBD interview experiences
BBD eligibility
BBD recruitment rounds
BBD company comparison


But BBD data must use the same universal database.

18. DO NOT DUPLICATE BBD DATA

Correct:

TCS
  ↓
BBD 2026 Drive
  ↓
Coding Round
  ↓
Question


Incorrect:

BBD TCS database
+
Global TCS database


There should be one canonical company record.

19. PLACEMENT DRIVE MODEL

Create:

company
college
year
session
role
drive


A drive can have:

Round 1
Round 2
Round 3
Interview


Different drives for the same company may have different processes.

20. COMPANY RECRUITMENT PROCESS

Company page should show:

Eligibility
Roles
Placement Process
Online Assessment
Aptitude
Coding
Technical
Interview
HR


But derive this from actual drive data.

Do not assume every company uses the same process.

21. MASSIVE APTITUDE DATABASE

Categories:

QUANTITATIVE

Number System
Percentages
Profit & Loss
Ratio
Average
Mixture
Alligation
Time & Work
Pipes
Time Speed Distance
Trains
Boats
Simple Interest
Compound Interest
Partnership
Ages
Probability
Permutation
Combination
Algebra
Geometry
Mensuration
Data Interpretation
Clocks
Calendars


LOGICAL

Series
Coding-Decoding
Blood Relations
Directions
Ranking
Seating Arrangement
Puzzles
Syllogism
Statements
Assumptions
Conclusions
Data Sufficiency
Venn Diagrams
Analogy
Classification


VERBAL

Reading Comprehension
Vocabulary
Synonyms
Antonyms
Grammar
Sentence Correction
Error Detection
Fill in the Blanks
Para Jumbles
Sentence Completion


22. TECHNICAL DATABASE

Include:

C
C++
Java
Python
JavaScript

OOP
DSA
DBMS
SQL
Operating Systems
Computer Networks
Computer Architecture
Compiler Design
Software Engineering
Web Development
Git
Linux
Cloud
Cyber Security
AI
Machine Learning
Data Science


23. COMPANY-SPECIFIC TECHNICAL QUESTIONS

For each company calculate:

Most Asked Subjects
Most Asked Topics
Frequently Reported Questions
Difficulty
Year Distribution


24. SQL QUESTION DATABASE

Include:

SELECT
WHERE
GROUP BY
HAVING
ORDER BY
JOIN
Subqueries
CTE
Window Functions
CASE
Aggregation
Duplicates
Ranking
Date Functions


Company-tag SQL questions should be supported.

25. INTERVIEW DATABASE

Create:

Technical Interview
Coding Interview
HR Interview
Managerial
Behavioral
Project Interview


Each question should support:

Company
College
Year
Role
Round
Source


26. INTERVIEW EXPERIENCE PARSER

Public interview experiences should be converted into structured information.

For example:

Raw experience
        ↓
Extract rounds
        ↓
Extract questions
        ↓
Extract company
        ↓
Extract role
        ↓
Extract year
        ↓
Store structured records


Keep the source reference.

27. QUESTION FREQUENCY ENGINE

This is essential.

Calculate:

Question frequency
Topic frequency
Company frequency
Year frequency
College frequency
Round frequency


Example:

Question:
Reverse Linked List

Companies:
Amazon
Microsoft
Adobe

Reports:
18

Years:
2022–2026


28. QUESTION RELATIONSHIPS

Support:

Duplicate
Variant
Similar
Same Concept
Repeated
Related


Example:

Second Largest Element
Second Maximum Element
Find Second Largest


could be related without blindly merging them.

29. GITHUB INGESTION SYSTEM

Build:

GitHub Discovery
      ↓
Repository Analyzer
      ↓
File Analyzer
      ↓
Question Extractor
      ↓
Company Extractor
      ↓
Year Extractor
      ↓
Topic Extractor
      ↓
Deduplication
      ↓
Normalization
      ↓
Import


30. REPOSITORY ANALYZER

Analyze:

README
Markdown
CSV
JSON
TXT
folders
company folders
question files
coding lists


where accessible.

31. AUTOMATIC CLASSIFICATION

Given:

"Amazon OA 2025 coding questions"


infer metadata:

Company = Amazon
Year = 2025
Round = Online Assessment
Category = Coding


But allow admin correction.

32. COMPANY ENTITY RESOLUTION

Map:

TCS
Tata Consultancy Services
Tata Consultancy


to one company.

Same for colleges.

33. DATA DEDUPLICATION

Use:

exact hash
normalized text
fuzzy similarity
problem ID
URL
company mapping


Do not create 15 copies of the same question from 15 repositories.

Instead:

One canonical question
+
15 source references


34. SOURCE GRAPH

Create a source graph:

QUESTION
 ├── Source A
 ├── Source B
 ├── Source C
 └── Source D


This allows:

number of reports
number of sources
first seen
last seen


35. DATA QUALITY

Every record should have:

verified
candidate-reported
source-derived
unverified
AI-generated


AI-generated content should never be confused with actual company questions.

36. ADMIN DATA CENTER

Build an extremely powerful admin dashboard.

Overview
Companies
Colleges
Questions
Coding
PYQs
Interviews
Repositories
Sources
Imports
Duplicates
Verification
Reports
2026 Data
BBD


37. GITHUB ADMIN CENTER

Show:

Repositories discovered
Repositories analyzed
Repositories imported
Questions discovered
Coding problems discovered
Companies discovered
Duplicates
Errors


38. BULK IMPORT

Support:

CSV
JSON
Markdown
TXT


with mapping.

39. IMPORT PREVIEW

Before importing:

Repository
Questions found
Coding problems
Interview questions
Companies
Years
Duplicates
Unknown records


Admin confirms import.

40. DATA VERSIONING

Store:

repository
commit
import date
source snapshot


where possible.

41. COMPANY DASHBOARD

For each company:

Company Overview
Recruitment Process
2026
2025
Historical
PYQs
Coding
Aptitude
Technical
SQL
Interview
Frequently Asked
Other Colleges
Mock Test
Readiness


42. COMPANY-WISE PREPARATION

User clicks:

Amazon


and gets:

What they ask
What they asked recently
Coding
Aptitude
Technical
Interview
Frequently repeated
2026
2025
Mock


43. FULL COMPANY SIMULATION

Create realistic practice simulations based on available data:

Online Assessment
       ↓
Coding
       ↓
Technical
       ↓
Interview


If actual data is incomplete:

clearly label it:

Practice Simulation


44. MOCK TEST ENGINE

Support:

Company Mock
PYQ Mock
2026 Mock
Topic Mock
Mixed Placement Mock
Full Simulation


Features:

Timer
Negative marking
Randomization
Section timing
Navigation
Mark for review
Auto-submit
Score
Accuracy
Time analysis


45. PERSONAL ANALYTICS

Track:

Questions attempted
Accuracy
Weak topics
Strong topics
Coding solved
Coding accuracy
Mock scores
Study time
Company readiness


46. COMPANY READINESS

Calculate:

Aptitude
PYQ Performance
Coding
Technical
Interview
Mock Performance
Recent Performance


Example:

TCS Readiness
72%

Aptitude 81%
Coding 67%
Technical 74%
PYQ 69%
Interview 70%


47. PERSONALIZED PREPARATION

User selects:

Target Company
Days Remaining
Hours Per Day


System generates:

Daily Tasks
PYQs
Coding
Technical
Mocks
Interview


based on actual weak areas.

48. GLOBAL SEARCH

Search everything.

Examples:

TCS 2026
Amazon coding
Microsoft interview
Accenture OA
BBD TCS
TCS VIT
2026 coding questions
DBMS placement questions


49. ADVANCED FILTERS

Allow:

Company
College
Year
Role
Round
Topic
Difficulty
Question Type
Source
Verification
2026
2025
PYQ
Coding
Interview


50. DATA COVERAGE DASHBOARD

Show actual database statistics:

Companies
Colleges
Questions
PYQs
2026 Questions
Coding Problems
Interview Questions
Sources
Repositories
Verified Questions


No fake numbers.

51. COMPANY COVERAGE

Example:

Amazon

Company Information ✓
Recruitment Process ✓
2026 Data ✓
2025 Data ✓
Coding ✓
PYQs ✓
Technical ✓
Interview ✓

Coverage: calculated from actual records


52. CROSS-COMPANY ANALYTICS

Allow:

TCS vs Infosys
Amazon vs Microsoft
Accenture vs Cognizant


Compare:

Recruitment Rounds
Question Topics
Coding Difficulty
Technical Subjects
Interview Topics
PYQ Coverage


53. YEAR COMPARISON

Allow:

Amazon 2025 vs Amazon 2026
TCS 2024 vs TCS 2025


Show actual differences in:

Rounds
Topics
Coding
Difficulty
Interview


54. MOST REPEATED QUESTIONS

Global page:

Most Repeated Placement Questions

Filters:

Company
Year
College
Topic


55. MOST ASKED CODING PROBLEMS

Global page:

Most Frequently Reported Company Coding Problems

Filters:

Company
Difficulty
Topic
Year


56. RECENTLY REPORTED QUESTIONS

Create:

Recently Reported

Prioritize:

2026
latest reports
latest placement drives


57. BBD CURRENT PLACEMENT INTELLIGENCE

The BBD section should have:

BBD 2026
Companies visited
Companies currently active
Latest reported questions
Latest drives
BBD PYQs
BBD interview experiences


This should be a specialized layer over the universal system.

58. USER SUBMISSIONS

Allow users to submit:

Company
College
Year
Role
Round
Question
Experience


Then:

Pending Review


59. MODERATION

Admin can:

Approve
Reject
Edit
Merge
Mark duplicate
Change company
Change year
Change round
Verify


60. NO STATIC FAKE DATA

Do NOT create fake:

Company visits
Questions
2026 reports
Packages
Eligibility
Rounds


Use actual imported/verified records.

61. SCALABILITY

Design for:

500+ companies
1000+ companies
100+ colleges
1000+ colleges
100,000+ questions
500,000+ questions
1,000,000+ questions
100,000+ coding problems


The architecture must continue working as the dataset grows.

62. DATABASE PERFORMANCE

Use:

PostgreSQL
Indexes
Full-text search
Trigram search
Pagination
Server-side filtering
Caching
Materialized/derived statistics where useful


Never load the entire question database into the browser.

63. FRONTEND

Use:

React
TypeScript
Vite
Tailwind
TanStack Query
React Router
Zod
React Hook Form


The UI design will be provided separately through my inspiration.

64. BACKEND

Prefer:

Supabase
PostgreSQL
Supabase Auth
Supabase Edge Functions
Supabase Storage


Use a separate backend service only where genuinely necessary.

65. CORE SERVICES

Create clean services:

companyService
collegeService
questionService
pyqService
codingService
interviewService
placementService
mockService
analyticsService
readinessService
githubService
importService
sourceService
recommendationService


66. SECURITY

Implement:

Authentication
RLS
Role permissions
Input validation
Rate limiting
Secure environment variables
Admin protection


67. CODING EXECUTION

If implementing browser coding:

support:

C
C++
Java
Python
JavaScript


using an isolated execution environment.

Never execute arbitrary code directly inside the main application server.

68. ADMIN ROLES

Student
Moderator
Admin
Super Admin


Super Admin controls:

sources
imports
companies
colleges
users
database


69. UI DESIGN

I will provide UI inspiration separately.

Do not finalize the visual language before receiving it.

The architecture must remain independent of the final visual design.

70. FINAL USER FLOW

Sign Up
 ↓
Select College
 ↓
Select Branch
 ↓
Select Graduation Year
 ↓
Select Target Companies
 ↓
Dashboard
 ↓
Company / Question / Coding
 ↓
Practice
 ↓
Mock
 ↓
Analytics
 ↓
Readiness
 ↓
Study Plan


71. THE MAIN DIFFERENTIATOR

The platform should not simply say:

"Here are 10,000 questions."

It should understand relationships:

Company
 ↓
Role
 ↓
College
 ↓
Year
 ↓
Drive
 ↓
Round
 ↓
Questions
 ↓
Sources
 ↓
Frequency
 ↓
Difficulty
 ↓
Topics


This relationship graph is the heart of the application.

72. FINAL DATA PIPELINE

Build this:

PUBLIC DATA SOURCES
        ↓
GITHUB DISCOVERY
        ↓
REPOSITORY ANALYSIS
        ↓
QUESTION EXTRACTION
        ↓
COMPANY EXTRACTION
        ↓
COLLEGE EXTRACTION
        ↓
YEAR EXTRACTION
        ↓
ROUND EXTRACTION
        ↓
TOPIC CLASSIFICATION
        ↓
NORMALIZATION
        ↓
DEDUPLICATION
        ↓
SOURCE MAPPING
        ↓
VERIFICATION
        ↓
DATABASE
        ↓
QUESTION INTELLIGENCE
        ↓
USER EXPERIENCE


73. FINAL COMMAND

Build this from scratch as a serious, scalable placement platform.

The primary objective is:

MAXIMUM COMPANY + QUESTION COVERAGE

The system should aggressively discover:

company-wise repositories

placement repositories

coding repositories

company-tagged coding datasets

interview question repositories

aptitude repositories

PYQ collections

public interview experiences

college placement data

current-year placement information

Do not restrict the architecture to a predefined small dataset.

Build the ingestion system so that thousands of new questions and new companies can continuously be added.

The platform must support:

COMPANIES
+
COLLEGES
+
YEARS
+
ROLES
+
ROUNDS
+
PYQs
+
CODING
+
APTITUDE
+
TECHNICAL
+
SQL
+
INTERVIEWS
+
CURRENT-YEAR QUESTIONS
+
CROSS-COLLEGE DATA
+
GITHUB DATA
+
FREQUENCY ANALYSIS
+
MOCK TESTS
+
COMPANY SIMULATION
+
ANALYTICS
+
READINESS
+
PERSONALIZED PREPARATION


with:

BBD PLACEMENT INTELLIGENCE

as one specialized college-specific section.

Do not build a BBD-first application.

Build a universal placement intelligence engine, and make BBD one of its supported colleges. and i want all frontend and working and ui look like this website i like it exactly like this : https://overrrides.com/

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4b550b96-590e-4f15-83d2-2f9c16df25c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
