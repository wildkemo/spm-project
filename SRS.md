# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document defines the Software Requirements Specification (SRS) for the **Gym Management System (GMS)**. The purpose of this document is to clearly describe what the system will do for the university project and to serve as a reference for development and evaluation.

### 1.2 Scope
The Gym Management System is a **simple web-based application** designed to manage basic gym operations. The system focuses on functionality rather than production-level quality. It is intended for academic use only.

The system will help manage:
- Gym members
- Trainers
- Membership plans
- Payments (manual entry)
- Attendance records
- Basic reports

### 1.3 Definitions, Acronyms, and Abbreviations
- **GMS**: Gym Management System
- **CRUD**: Create, Read, Update, Delete
- **SRS**: Software Requirements Specification

### 1.4 References
- Gym Management System Project Description (SPM Course)

### 1.5 Overview
This SRS describes the overall system, its users, and its functional and non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective
The Gym Management System is a standalone web application. It consists of:
- A web interface
- A backend application (as simple as possible)
- A database (as simple as possible (sqllite or noSQL))

### 2.2 Product Functions
The system shall provide the following main functions:
- Manage gym members
- Manage trainers
- Manage membership plans
- Record payments
- Track attendance
- Generate simple reports

### 2.3 User Classes and Characteristics
| User Type | Description |
|---------|------------|
| Admin | Manages the system and data |
| Staff | Registers members and records payments |
| Trainer | Views schedules and attendance |

### 2.4 Operating Environment
- Accessed through a web browser
- Runs on a standard computer

### 2.5 Design Constraints
- The system is developed for a university project
- No real-world deployment requirements are considered

### 2.6 Assumptions and Dependencies
- Users have basic computer skills
- Data is entered manually by staff

---

## 3. System Features (Functional Requirements)

### 3.1 Login System
**Description:** The system provides a basic login system.

**Requirements:**
- The system shall allow users to log in
- The system shall identify users by role

### 3.2 Member Management
**Description:** The system manages gym members.

**Requirements:**
- The system shall allow adding new members
- The system shall allow viewing member details
- The system shall allow updating member information
- The system shall allow deleting members
- The system shall store membership start and end dates

### 3.3 Trainer Management
**Description:** The system manages trainers.

**Requirements:**
- The system shall allow adding trainers
- The system shall allow updating trainer details
- The system shall allow deleting trainers

### 3.4 Membership Plans
**Description:** The system manages membership plans.

**Requirements:**
- The system shall allow creating membership plans
- The system shall store plan duration and price
- The system shall assign plans to members

### 3.5 Payment Management
**Description:** The system records payments manually.

**Requirements:**
- The system shall allow recording payments
- The system shall link payments to members
- The system shall display payment history

### 3.6 Attendance Management
**Description:** The system tracks attendance.

**Requirements:**
- The system shall allow checking in members
- The system shall record attendance date and time
- The system shall display attendance records

### 3.7 Scheduling
**Description:** The system manages trainer schedules.

**Requirements:**
- The system shall allow creating schedules for trainers
- The system shall display schedules

### 3.8 Reporting
**Description:** The system generates simple reports.

**Requirements:**
- The system shall generate attendance reports
- The system shall generate payment reports
- The system shall show memberships nearing expiration

### 3.9 Dashboard
**Description:** The system provides a summary view.

**Requirements:**
- The system shall display number of members
- The system shall display recent attendance
- The system shall display total payments

---

## 4. External Interface Requirements

### 4.1 User Interface
- Simple web-based interface
- Forms for data entry
- Tables for displaying data

### 4.2 Hardware Interface
- No special hardware requirements

### 4.3 Software Interface
- Uses a database to store information

### 4.4 Communication Interface
- Web-based communication

---

## 5. Non-Functional Requirements

### 5.1 Usability
- The system shall be easy to use
- The system shall require minimal training

### 5.2 Reliability
- The system shall store data correctly

### 5.3 Maintainability
- The system shall be easy to modify for the project

---

## 6. Other Requirements

### 6.1 Limitations
- The system is for academic use only
- Security and real-world deployment are out of scope

---

## 7. Appendix

### 7.1 Future Improvements
- Online payments
- Member self-service access

### 7.2 Approval
This document represents the final SRS for the Gym Management System university project.
