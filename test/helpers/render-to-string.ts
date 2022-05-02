import {render} from '../../dist';
import createStdout from './create-stdout';

export const renderToString: (
	node: JSX.Element,
	options?: {columns: number}
) => string = (node, options = {columns: 100}) => {
	const stdout = createStdout(options.columns);

	render(node, {
		// @ts-ignore
		stdout,
		debug: true
	});

	return stdout.get();
};
