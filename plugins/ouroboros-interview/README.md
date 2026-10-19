# Ouroboros interview

A standalone Socratic requirements interview for an existing agent session.
It clarifies goals, constraints, and acceptance criteria, checks for material
unresolved decisions, and ends with an agreed requirements summary.

## Contents

The plugin contains one skill, `interview`, and four reference prompts:
Socratic interviewer, interview closer, contrarian, and gap hunter. The host
reads code, asks questions, and runs review subagents through its native tools.
When subagents are unavailable, the skill uses clearly identified self-review.
It requires no additional runtime packages or services.

The skill does not install software, change agent configuration, write
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
```

For another host that loads skill folders, load `skills/interview` from this
plugin directory. Keep its `references` directory beside `SKILL.md`.

## Checks

From the fork's checkout, validate the plugin and its isolated distribution:

```sh
claude plugin validate ./plugins/ouroboros-interview
node --test tests/interview-plugin.test.mjs
```

These checks validate packaging and local references, not interview quality.

## Source and license

The interview and review method is adapted from
[Q00/ouroboros](https://github.com/Q00/ouroboros). Only this directory is the
interview-only distribution. The other directories in the fork are not part
of the plugin.

The plugin retains the upstream [MIT license](LICENSE).
