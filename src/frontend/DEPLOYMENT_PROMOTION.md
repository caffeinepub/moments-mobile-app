# Deployment Promotion Guide

This document describes the process for promoting a draft build to production.

## Overview

The application uses a versioned deployment system where draft builds can be promoted to production through the backend canister's deployment management functions.

## Current Status

- **Current Draft Version**: 140
- **Current Production Version**: Check via `getCurrentProductionVersion()` query

## Promotion Process

### Prerequisites

1. Verify you have admin access to the backend canister
2. Confirm the draft version (140) is ready for production
3. Ensure you're authenticated with Internet Identity

### Steps to Promote Draft v140 to Production

1. **Pre-deployment Checks**
   - Verify current draft version: Call `getCurrentDraftVersion()`
   - Verify current production version: Call `getCurrentProductionVersion()`
   - Confirm draft v140 exists and has status `#draft`

2. **Execute Promotion**
   - Call the backend method: `promoteBuildToProduction(140n)`
   - This will:
     - Archive the current production version (if any)
     - Promote draft v140 to production status
     - Update the production version pointer

3. **Post-deployment Verification**
   - Call `getCurrentProductionVersion()` to confirm it returns version 140
   - Verify the build status is `#production`
   - Check that `promotedBy` field contains your principal ID
   - Test the live application to ensure it's functioning correctly

### Using the Backend Interface

