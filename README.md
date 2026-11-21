# DemoBlaze E2E Automation

End-to-end tests for the DemoBlaze website using Playwright and TypeScript.

## Coverage

- Log in with valid credentials
- Add products to the cart
- Verify cart items and total price
- Place an order and validate the receipt

## Tech stack

- TypeScript
- Playwright Test
- GitHub Actions

## Setup

Install project dependencies and Playwright browsers:

```bash
npm ci
npx playwright install

**## Run full test suite**

npx playwright test

**## Run E2E suite**
npx playwright test "tests/e2e suite/e2e.spec.ts"

**## Open HTML Report**
npx playwright show-report
