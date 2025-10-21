# Gemini API Models Reference

## Current Model Used

**Model:** `gemini-1.5-flash-latest`

This is the latest stable version of Gemini 1.5 Flash, optimized for:
- Fast responses
- Cost-effective
- Good quality outputs
- Supports long context

## Model History (Why We Changed)

### ❌ gemini-pro (DEPRECATED)
- **Status**: Deprecated, no longer available
- **Error**: `models/gemini-pro is not found for API version v1beta`
- **Date Deprecated**: 2024

### ❌ gemini-1.5-flash
- **Status**: Not available in v1beta API
- **Error**: `models/gemini-1.5-flash is not found for API version v1beta`
- **Issue**: Incorrect model name for current API

### ✅ gemini-1.5-flash-latest (CURRENT)
- **Status**: Active and working
- **API Version**: v1beta
- **Features**:
  - Latest stable version
  - Automatically updates to newest flash model
  - Best performance/cost ratio
  - Suitable for production

## Alternative Models

If `gemini-1.5-flash-latest` has issues, try these alternatives:

### gemini-1.5-pro-latest
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
```
- Higher quality outputs
- Slower response time
- More expensive
- Better for complex tasks

### gemini-1.0-pro
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
```
- Older stable version
- Fallback option
- Lower cost
- Shorter context window

## How to Change Models

To change the model, update these 3 files:

1. `/app/api/generate-ideas/route.ts` (line ~72)
2. `/app/api/idea-details/route.ts` (line ~67)
3. `/app/api/test-gemini/route.ts` (line ~22)

Change:
```typescript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest'
});
```

## Testing

After changing models, test with:
https://ideatorapp.vercel.app/api/test-gemini

Should return:
```json
{
  "test": {
    "success": true,
    "response": "..."
  }
}
```

## Documentation

Official Gemini models list:
https://ai.google.dev/gemini-api/docs/models/gemini

## Current Status

✅ Model: `gemini-1.5-flash-latest`
✅ API Version: v1beta
✅ Status: Working
✅ Last Updated: 2025-10-21
