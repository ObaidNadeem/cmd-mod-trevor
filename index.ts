// cmd-mod-trevor: the agent talks like Trevor while it works.
//
// - appendSystemPrompt adds the persona, tuned by the wanted level (1-5 stars).
// - /trevor turns it on or off and sets the wanted level; both persist across sessions.
// - The footer shows the wanted stars, and the spinner runs Trevor's own status lines.

import type {ModApi, ModCommandResult} from '@commandcode/harness';
import {
	buildPersonaPrompt,
	MAX_WANTED,
	MIN_WANTED,
	parseAction,
	pickEntrance,
	pickSpinnerLine,
	renderStars,
	toConfig,
	type TrevorConfig,
} from './persona';

const CONFIG_KEY = 'config';
const YELLOW = '\u001B[33m';
const BOLD = '\u001B[1m';
const RESET = '\u001B[0m';

const USAGE = `/trevor on | off | ${MIN_WANTED}-${MAX_WANTED}  (the number sets the wanted level)`;

export default function (cmd: ModApi): void {
	const readConfig = (): TrevorConfig => toConfig(cmd.store.get(CONFIG_KEY));

	const showStatus = (config: TrevorConfig): void => {
		if (!config.isOn) {
			cmd.ui.setStatus(null);
			return;
		}
		cmd.ui.setStatus(`${BOLD}TREVOR${RESET} ${YELLOW}${renderStars(config.wanted)}${RESET}`);
	};

	const saveConfig = async (config: TrevorConfig): Promise<void> => {
		await cmd.store.set(CONFIG_KEY, config);
		showStatus(config);
	};

	cmd.hooks({
		appendSystemPrompt: () => {
			const config = readConfig();
			if (!config.isOn) return undefined;
			return buildPersonaPrompt(config.wanted);
		},
		onSessionStart: ({source}) => {
			const config = readConfig();
			showStatus(config);
			if (!config.isOn || source === 'reload') return;
			cmd.ui.toast(pickEntrance(Date.now()), {level: 'warning'});
		},
		onSessionEnd: () => {
			cmd.ui.setStatus(null);
		},
	});

	cmd.ui.override('spinner', (props, next) => {
		if (!readConfig().isOn) return undefined;
		return [{type: 'text', text: pickSpinnerLine(props.elapsedMs), color: 'yellow'}, ...(next() ?? [])];
	});

	cmd.addCommand({
		name: 'trevor',
		description: 'Trevor persona: on, off, or set the wanted level 1-5',
		argumentHint: `[on|off|${MIN_WANTED}-${MAX_WANTED}]`,
		handler: async ({args}): Promise<ModCommandResult> => {
			const config = readConfig();
			const action = parseAction(args);

			if (action.type === 'invalid') {
				return {message: `"${action.input}"? Not a thing, partner. Try ${USAGE}`};
			}
			if (action.type === 'show') {
				const state = config.isOn ? `on, wanted ${renderStars(config.wanted)}` : 'off';
				return {message: `Trevor is ${state}. ${USAGE}`};
			}
			if (action.type === 'off') {
				await saveConfig({...config, isOn: false});
				return {message: 'Fine. FINE. Trevor is off. Enjoy your boring agent.'};
			}
			if (action.type === 'on') {
				await saveConfig({...config, isOn: true});
				return {message: `Trevor is back. Wanted ${renderStars(config.wanted)}`};
			}

			await saveConfig({isOn: true, wanted: action.wanted});
			return {message: `Wanted level ${renderStars(action.wanted)}. Applies from the next reply.`};
		},
	});
}
