# Ouroboros interview and unstuck

Standalone Socratic interview and lateral-thinking workflows for an existing
agent session. The interview clarifies goals, constraints, and acceptance
criteria. Unstuck examines repeated failures or consequential decisions from
independent perspectives and recommends one next move.

## Contents

The plugin contains two skills:

- `interview`, with Socratic interviewer, interview closer, contrarian, and gap
  hunter prompts.
- `unstuck`, with hacker, researcher, simplifier, architect, and contrarian
  prompts.

The host reads relevant sources, asks questions, and runs review subagents
through its native tools. When subagents are unavailable, the skills use
clearly identified self-review. They require no additional runtime packages or
services.

The skills do not install software, change agent configuration, write
preference files, check for updates, or start implementation. Results remain in
the conversation unless the user requests a summary file.

## Use

Install the `ouroboros-interview` entry from the
[ramtoshiya marketplace](https://github.com/ramtoshiya/skills), following its
[plugin instructions](https://github.com/ramtoshiya/skills/blob/main/docs/agent-pack.md).
In Claude Code:

```sh
claude plugin install ouroboros-interview@ramtoshiya --scope user
```

Reload the plugins, then invoke:

```text
/ouroboros-interview:interview Describe the idea or decision to clarify.
/ouroboros-interview:unstuck Describe the repeated failure or hard decision.
```

For another host that loads skill folders, load `skills/interview` or
`skills/unstuck` from this plugin directory. Keep each skill's `references`
directory beside `SKILL.md`.

## Checks

From the fork's checkout, validate the plugin and its isolated distribution:

```sh
claude plugin validate ./plugins/ouroboros-interview
node --test tests/interview-plugin.test.mjs
```

These checks validate packaging and local references, not workflow quality.

## Source and license

The interview, review, and lateral-thinking methods are adapted from
[Q00/ouroboros](https://github.com/Q00/ouroboros). Only this directory is the
standalone distribution. The other directories in the fork are not part of the
plugin.

The plugin retains the upstream [MIT license](LICENSE).
