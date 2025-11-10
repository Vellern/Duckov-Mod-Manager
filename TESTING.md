# Testing Guide - Duckov Mod Manager

## Overview

This document describes the comprehensive test suite for the Duckov Mod Manager Electron application. The test suite uses **Jest** with **ts-jest** for TypeScript support and includes tests for all critical services.

## Test Coverage

### Test Suites

1. **OfflineTranslationService.test.ts** (22 tests)
   - Service initialization and configuration
   - Translation operations with caching
   - Batch translation support
   - Cache management and statistics
   - Error handling and validation

2. **Database.test.ts** (28 tests)
   - Database initialization
   - CRUD operations for mods
   - Translation cache operations
   - Search and pagination
   - Error handling

3. **ModService.test.ts** (29 tests)
   - Service initialization
   - Local mod scanning
   - Translation integration
   - Mod retrieval and search
   - Mod export to ZIP
   - Statistics and bulk operations
   - Error handling

**Total: 79 tests - ALL PASSING**

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose

# Run tests in CI environment
npm run test:ci
```

### Running Specific Test Files

```bash
# Run only Database tests
npm test -- --testPathPattern="Database.test"

# Run only OfflineTranslationService tests
npm test -- --testPathPattern="OfflineTranslationService.test"

# Run only ModService tests
npm test -- --testPathPattern="ModService.test"
```

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- --testNamePattern="should translate"

# Run a specific test file with coverage
npm test -- --testPathPattern="Database" --coverage
```

## Test Structure

### Directory Layout

```
src/
├── __tests__/
│   └── utils/
│       └── testHelpers.ts          # Shared test utilities
├── database/
│   ├── __tests__/
│   │   └── Database.test.ts        # Database tests
│   └── Database.ts
└── services/
    ├── __tests__/
    │   ├── OfflineTranslationService.test.ts
    │   └── ModService.test.ts
    ├── OfflineTranslationService.ts
    ├── ModService.ts
    └── LocalModService.ts
```

## Test Utilities

### testHelpers.ts

Provides reusable utilities for testing:

- **Database Helpers**
  - `createTestDatabase()` - Creates isolated test database
  - `cleanupTestDb()` - Cleans up test database
  - `createTestDbPath()` - Generates unique DB paths

- **Mock Generators**
  - `createMockMod()` - Creates mock ModInfo objects
  - `createMockTranslatedMod()` - Creates translated mods
  - `createMockTranslation()` - Creates translation objects
  - `createMockMods()` - Generates multiple mods

- **Workshop Helpers**
  - `createTestWorkshopDir()` - Creates test workshop directory
  - `createMockModFolder()` - Creates mod folder with files
  - `cleanupTestWorkshopDir()` - Removes test directories

- **Utility Functions**
  - `suppressConsoleOutput()` - Suppresses console during tests
  - `wait()` - Async delay utility
  - `assertDefined()` - TypeScript type guard

## Key Test Features

### 1. Isolated Test Databases

Each test suite gets its own SQLite database to prevent test interference:

```typescript
beforeEach(async () => {
  database = await createTestDatabase('test-name');
});

afterEach(async () => {
  await database.close();
  cleanupTestDb('test-name');
});
```

### 2. Mocked Dependencies

All external dependencies are mocked:

- **Electron**: Mocked app.getPath() for consistent paths
- **@xenova/transformers**: Mocked translation pipeline
- **File System**: Temporary test directories

### 3. Comprehensive Coverage

Tests cover:
- ✅ Happy path scenarios
- ✅ Error handling
- ✅ Edge cases (empty inputs, invalid data)
- ✅ Async operations
- ✅ Database transactions
- ✅ File I/O operations
- ✅ Concurrent operations

## Test Categories

### Unit Tests

- Test individual functions and methods
- Mock all external dependencies
- Fast execution (< 5 seconds for all tests)

### Integration Tests

- Test service interactions
- Use real SQLite database (in-memory/temp)
- Test data flow between components

## Coverage Reports

After running `npm run test:coverage`, view reports:

- **Console**: Summary in terminal
- **HTML**: Open `coverage/lcov-report/index.html` in browser
- **LCOV**: Machine-readable `coverage/lcov.info`

### Coverage Thresholds

Current thresholds (configurable in jest.config.js):
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Writing New Tests

### Basic Test Structure

```typescript
import { ServiceName } from '../ServiceName';
import { createTestDatabase, cleanupTestDb } from '../__tests__/utils/testHelpers';

describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(async () => {
    // Setup
    service = new ServiceName();
  });

  afterEach(async () => {
    // Cleanup
  });

  test('should do something', async () => {
    // Arrange
    const input = 'test';

    // Act
    const result = await service.method(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Best Practices

1. **Use Descriptive Test Names**
   - ✅ `should translate Chinese text to English`
   - ❌ `translation test`

2. **Follow AAA Pattern**
   - Arrange: Set up test data
   - Act: Execute the code
   - Assert: Verify results

3. **Test One Thing**
   - Each test should verify one behavior
   - Keep tests focused and simple

4. **Clean Up Resources**
   - Always close databases
   - Remove temporary files
   - Clear mocks between tests

5. **Use Async/Await**
   - All async tests should use async/await
   - Don't forget to await promises

## Continuous Integration

Tests are designed to run in CI environments:

```bash
npm run test:ci
```

Features:
- Non-interactive mode
- Coverage reporting
- Limited parallel workers
- Exit on completion

## Troubleshooting

### Tests Fail Due to Open Handles

Jest may warn about open handles. Common causes:
- Database connections not closed
- Timers not cleared
- Promises not resolved

**Fix**: Ensure all cleanup in `afterEach` blocks.

### Tests Are Slow

If tests take too long:
- Check for unnecessary waits/delays
- Use mocks instead of real I/O
- Run specific test files during development

### Mock Issues

If mocks don't work:
- Ensure mocks are defined BEFORE imports
- Check mock paths are correct
- Verify `jest.clearAllMocks()` in `afterEach`

### Database Errors

If database tests fail:
- Check DB paths are unique per test
- Verify cleanup functions are called
- Ensure proper async/await usage

## Test Data

### Sample Mod Data

```typescript
{
  id: '12345',
  title: '测试模组',
  description: '这是一个测试模组的描述',
  creator: 'TestCreator',
  fileSize: 1024000,
  subscriptions: 100,
  rating: 4.5,
  tags: ['gameplay', 'weapons'],
  timeCreated: new Date(),
  timeUpdated: new Date(),
  language: 'zh'
}
```

### Translation Cache

```typescript
{
  originalText: '你好世界',
  translatedText: 'Hello World',
  sourceLang: 'zh',
  targetLang: 'en',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
}
```

## Future Improvements

Potential enhancements:
- [ ] Add E2E tests for Electron app
- [ ] Add performance benchmarks
- [ ] Increase coverage to 90%+
- [ ] Add mutation testing
- [ ] Add visual regression tests
- [ ] Add load testing for bulk operations

## Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [TypeScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Support

For issues or questions about tests:
1. Check this documentation
2. Review test files for examples
3. Check Jest error messages
4. Consult Jest documentation

---

**Last Updated**: 2025-11-10
**Test Framework**: Jest 29.7.0
**TypeScript**: 5.2.2
**Node.js**: 20.8.0+
