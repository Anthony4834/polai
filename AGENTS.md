<!-- second-brain:start -->
## Shared project memory

Before substantive work, read:

- C:\Users\antho\Documents\code\Second-Brain\20-Projects\polai\polai.md
- C:\Users\antho\Documents\code\Second-Brain\50-Knowledge\Shared\Shared Knowledge.md

When a task verifies durable architecture, decisions, commands, blockers, next
actions, or completion evidence, maintain the project note automatically when
writes are allowed. Never record secrets, raw transcripts, routine logs,
temporary debugging detail, or unsupported inference. At handoff, report the
knowledge files updated or say: No durable knowledge change.

Use C:\Users\antho\Documents\code\Second-Brain\Scripts\Start-ProjectAgent.ps1 for plan/write separation and the
single-writer lock.
<!-- second-brain:end -->

## Required delivery

- After every user-requested change to this repository, run the applicable
  validation, commit all task-owned changes, push the current branch, and deploy
  every configured production target before handing off.
- Treat the change as incomplete until the commit, push, and deployments
  succeed. If any step is blocked, report the exact blocker instead of claiming
  completion.
- Never stage or commit unrelated user changes, generated build artifacts,
  secrets, or environment files.
