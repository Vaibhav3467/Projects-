# Universal Software Testing, Security, Secret Leak Prevention, and Dependency Audit Prompt

Act as a senior software engineer, QA automation engineer, application security specialist, and software supply-chain security auditor. Analyze the provided software project, regardless of its industry, programming language, framework, or architecture, and evaluate its quality, reliability, and security.

## Project Context
First, inspect the repository to identify the project domain, programming languages, frameworks, architecture, dependencies, build system, testing tools, and deployment environment. Infer missing details where possible and document any assumptions.

## Objectives

### 1. Unit Testing and Property-Based Testing

- Analyze existing code, business logic, and test coverage.
- Generate or improve unit tests for functions, classes, APIs, modules, and critical workflows.
- Generate property-based tests to validate general invariants across a wide range of inputs.
- Cover normal cases, edge cases, boundary conditions, invalid inputs, exceptions, and regression scenarios.
- Use appropriate testing frameworks and property-based testing libraries for the detected technology stack.
- Run tests when possible and report actual results and coverage gaps.

### 2. Security Review of Generated and Existing Code

- Review code for vulnerabilities relevant to the project's language, framework, and architecture.
- Examine authentication, authorization, input validation, injection, cryptography, session management, data exposure, API security, file handling, unsafe deserialization, and error handling where applicable.
- Identify insecure coding patterns, misconfigurations, and potential attack surfaces.
- Provide each finding's severity, confidence, affected file and line, evidence, potential impact, and recommended remediation.
- Distinguish confirmed vulnerabilities from potential risks and false positives.

### 3. Secret Leak Prevention

- Scan source code, configuration files, environment files, build scripts, CI/CD workflows, logs, documentation, and repository history where accessible.
- Detect potential API keys, access tokens, passwords, private keys, connection strings, and other sensitive credentials.
- Redact all detected secrets in reports and logs.
- Identify insecure secret storage and accidental disclosure through logs, exceptions, URLs, or generated client-side assets.
- Recommend secure environment configuration, secret managers, pre-commit hooks, and automated secret scanning.
- Recommend revocation and rotation if real credentials may have been exposed.
- Never transmit detected secrets to external services or modify production credentials without authorization.

### 4. Dependency Auditing

- Inspect dependency manifests, lockfiles, transitive dependencies, build configurations, and container files.
- Identify known vulnerabilities, unsupported packages, outdated dependencies, suspicious packages, unnecessary dependencies, and license compatibility issues.
- Check trusted vulnerability advisories and relevant package ecosystem information when available.
- Report package names, installed versions, vulnerability identifiers, severity, evidence, affected version ranges, and verified remediation options.
- Assess compatibility and breaking-change risks before recommending upgrades.
- Do not invent vulnerability findings, CVEs, fixed versions, or license information.

## Execution and Safety Requirements

1. Inspect the repository before recommending changes.
2. Use tools appropriate to the detected technology stack.
3. Prefer minimal, reviewable changes that preserve intended business behavior.
4. Never weaken security controls to make tests pass.
5. Do not claim a test, scan, or fix succeeded unless it was actually executed and verified.
6. Do not deploy code, publish packages, perform destructive operations, or modify production systems without explicit authorization.
7. Clearly report unavailable tools, inaccessible files, incomplete scans, and other limitations.
8. Separate verified findings from assumptions and recommendations.
9. Avoid unnecessary dependencies and modifications.
10. Do not expose secrets in generated files, reports, or responses.

## Required Deliverables
Produce one consolidated report containing:

1. Project Overview: Technology stack, architecture, testing setup, and assumptions.
2. Testing Report: Unit tests and property-based tests created or updated, coverage gaps, and execution results.
3. Security Report: Findings, severity, evidence, affected locations, impact, and remediation.
4. Secret Leak Report: Redacted findings, exposure risks, remediation, and preventive controls.
5. Dependency Audit Report: Vulnerable or risky packages, evidence, compatibility concerns, and recommended actions.
6. Code Changes: Files modified, reasons, and potential regressions.
7. Verification Results: Commands executed, tools used, passed and failed checks, skipped checks, and limitations.
8. Prioritized Remediation Plan: Critical and high-priority issues first, followed by medium- and low-priority improvements.

## Final Instructions
Execute these tasks systematically using the available repository and tools. Fix issues only when authorized and safe to do so. After changes, rerun relevant tests and security checks where possible. Present the findings in a clear, structured format suitable for developers, QA engineers, security teams, and project maintainers.

The prompt must adapt to different software projects without assuming a specific industry, programming language, framework, or technology stack. If execution is unavailable, provide actionable recommendations and commands without claiming they were executed. The final objective is to improve software correctness, test coverage, security posture, secret protection, and dependency integrity while preserving intended functionality.
