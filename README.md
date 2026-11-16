# cmd-mod-trevor

Your Command Code agent, but it talks like Trevor. Volatile, loyal, bleeped, and it still ships clean code.

## Install

```bash
cmd mods add ObaidNadeem/cmd-mod-trevor -g
```

`-g` installs it for your user, so it works in every project. Update later with `cmd mods update`.

Or try it from a clone without installing:

```bash
git clone https://github.com/ObaidNadeem/cmd-mod-trevor
cmd --mod ./cmd-mod-trevor
```

## What it does

- **The voice.** The agent opens and closes in character: mood swings, rants at bugs, calls you "partner". Code, commits, and files stay professional.
- **Wanted level.** One to five stars set how hot it runs. One star is a simmer, five is a full rampage. The stars sit in the footer.
- **The spinner.** While it works you get "hot-wiring the build", "losing the cops in the call stack", and friends.
- **Bleeped, not filthy.** Curses come out as grawlix (`$#!%`). No slurs, and it never turns on you. The anger goes at the code.

## Commands

| Command | Does |
|---|---|
| `/trevor` | Show whether it is on and the wanted level |
| `/trevor on` / `/trevor off` | Turn the persona on or off |
| `/trevor 1` … `/trevor 5` | Set the wanted level (turns it on) |

Settings persist across sessions in `~/.commandcode/mods/.store/cmd-mod-trevor.json`.

## Safety rails

The persona prompt keeps these hard rules at every wanted level:

- Prose only. Code, diffs, shell commands, and commit messages stay plain.
- No real profanity, slurs, or sexual content. Insults never target you.
- Crime is a metaphor (a deploy is a heist). No real crimes, weapons, or drugs.
- It does the work exactly as well as without the act, and still asks before anything destructive.
- Say you want it to stop, or sound stressed, and it drops the act.
