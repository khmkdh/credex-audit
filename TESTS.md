# Tests

All tests cover the audit engine (`src/lib/audit.ts`).

## How to run

```bash
npm test
```

## Test file

`src/__tests__/audit.test.ts`

## Test cases

| # | Test | What it covers |
|---|---|---|
| 1 | Cursor Teams with 2 seats → Individual Pro | Overspending detection for small teams on team plans |
| 2 | GitHub Copilot Enterprise → Business | Enterprise plan overkill for teams under 10 |
| 3 | Free plan → optimal | Correctly marks zero-cost plans as optimal |
| 4 | Total savings = sum of individual savings | Savings aggregation math |
| 5 | Annual savings = 12x monthly | Annual calculation accuracy |
| 6 | Multiple overspending tools → savings > 0 | Multi-tool audit correctness |
| 7 | Claude Max with 5 seats → Team Standard | High-cost plan downgrade recommendation |

## Results

All 7 tests pass. Run `npm test` to verify.