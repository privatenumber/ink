import react, { ReactNode, ReactElement, FC } from 'react';
import { LiteralUnion, Except } from 'type-fest';
import { Boxes } from 'cli-boxes';
import { ForegroundColor } from 'chalk';
import Yoga from 'yoga-layout-prebuilt';

interface Options$1 {
    stdout: NodeJS.WriteStream;
    stdin: NodeJS.ReadStream;
    stderr: NodeJS.WriteStream;
    debug: boolean;
    exitOnCtrlC: boolean;
    patchConsole: boolean;
    waitUntilExit?: () => Promise<void>;
}
declare class Ink {
    private readonly options;
    private readonly log;
    private readonly throttledLog;
    private isUnmounted;
    private lastOutput;
    private readonly container;
    private readonly rootNode;
    private fullStaticOutput;
    private exitPromise?;
    private restoreConsole?;
    private readonly unsubscribeResize?;
    constructor(options: Options$1);
    resolveExitPromise: () => void;
    rejectExitPromise: (reason?: Error) => void;
    unsubscribeExit: () => void;
    onRender: () => void;
    render(node: ReactNode): void;
    writeToStdout(data: string): void;
    writeToStderr(data: string): void;
    unmount(error?: Error | number | null): void;
    waitUntilExit(): Promise<void>;
    clear(): void;
    patchConsole(): void;
}

interface RenderOptions {
    /**
     * Output stream where app will be rendered.
     *
     * @default process.stdout
     */
    stdout?: NodeJS.WriteStream;
    /**
     * Input stream where app will listen for input.
     *
     * @default process.stdin
     */
    stdin?: NodeJS.ReadStream;
    /**
     * Error stream.
     * @default process.stderr
     */
    stderr?: NodeJS.WriteStream;
    /**
     * If true, each update will be rendered as a separate output, without replacing the previous one.
     *
     * @default false
     */
    debug?: boolean;
    /**
     * Configure whether Ink should listen to Ctrl+C keyboard input and exit the app. This is needed in case `process.stdin` is in raw mode, because then Ctrl+C is ignored by default and process is expected to handle it manually.
     *
     * @default true
     */
    exitOnCtrlC?: boolean;
    /**
     * Patch console methods to ensure console output doesn't mix with Ink output.
     *
     * @default true
     */
    patchConsole?: boolean;
}
interface Instance {
    /**
     * Replace previous root node with a new one or update props of the current root node.
     */
    rerender: Ink['render'];
    /**
     * Manually unmount the whole Ink app.
     */
    unmount: Ink['unmount'];
    /**
     * Returns a promise, which resolves when app is unmounted.
     */
    waitUntilExit: Ink['waitUntilExit'];
    cleanup: () => void;
    /**
     * Clear output.
     */
    clear: () => void;
}
declare type RenderFunction = <Props, K extends NodeJS.WriteStream | RenderOptions>(tree: ReactElement<Props>, options?: K) => Instance;
/**
 * Mount a component and render the output.
 */
declare const render: RenderFunction;

interface Styles {
    readonly textWrap?: 'wrap' | 'end' | 'middle' | 'truncate-end' | 'truncate' | 'truncate-middle' | 'truncate-start';
    readonly position?: 'absolute' | 'relative';
    /**
     * Top margin.
     */
    readonly marginTop?: number;
    /**
     * Bottom margin.
     */
    readonly marginBottom?: number;
    /**
     * Left margin.
     */
    readonly marginLeft?: number;
    /**
     * Right margin.
     */
    readonly marginRight?: number;
    /**
     * Top padding.
     */
    readonly paddingTop?: number;
    /**
     * Bottom padding.
     */
    readonly paddingBottom?: number;
    /**
     * Left padding.
     */
    readonly paddingLeft?: number;
    /**
     * Right padding.
     */
    readonly paddingRight?: number;
    /**
     * This property defines the ability for a flex item to grow if necessary.
     * See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).
     */
    readonly flexGrow?: number;
    /**
     * It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
     * See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).
     */
    readonly flexShrink?: number;
    /**
     * It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
     * See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).
     */
    readonly flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    /**
     * It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
     * See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).
     */
    readonly flexBasis?: number | string;
    /**
     * The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
     * See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).
     */
    readonly alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    /**
     * It makes possible to override the align-items value for specific flex items.
     * See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).
     */
    readonly alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'auto';
    /**
     * It defines the alignment along the main axis.
     * See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).
     */
    readonly justifyContent?: 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'center';
    /**
     * Width of the element in spaces.
     * You can also set it in percent, which will calculate the width based on the width of parent element.
     */
    readonly width?: number | string;
    /**
     * Height of the element in lines (rows).
     * You can also set it in percent, which will calculate the height based on the height of parent element.
     */
    readonly height?: number | string;
    /**
     * Sets a minimum width of the element.
     */
    readonly minWidth?: number | string;
    /**
     * Sets a minimum height of the element.
     */
    readonly minHeight?: number | string;
    /**
     * Set this property to `none` to hide the element.
     */
    readonly display?: 'flex' | 'none';
    /**
     * Add a border with a specified style.
     * If `borderStyle` is `undefined` (which it is by default), no border will be added.
     */
    readonly borderStyle?: keyof Boxes;
    /**
     * Change border color.
     * Accepts the same values as `color` in <Text> component.
     */
    readonly borderColor?: LiteralUnion<typeof ForegroundColor, string>;
}

declare type OutputTransformer = (s: string) => string;

interface InkNode {
    parentNode: DOMElement | null;
    yogaNode?: Yoga.YogaNode;
    internal_static?: boolean;
    style: Styles;
}
declare type TextName = '#text';
declare type ElementNames = 'ink-root' | 'ink-box' | 'ink-text' | 'ink-virtual-text';
declare type NodeNames = ElementNames | TextName;
declare type DOMElement = {
    nodeName: ElementNames;
    attributes: {
        [key: string]: DOMNodeAttribute;
    };
    childNodes: DOMNode[];
    internal_transform?: OutputTransformer;
    isStaticDirty?: boolean;
    staticNode?: any;
    onRender?: () => void;
    onImmediateRender?: () => void;
} & InkNode;
declare type TextNode = {
    nodeName: TextName;
    nodeValue: string;
} & InkNode;
declare type DOMNode<T = {
    nodeName: NodeNames;
}> = T extends {
    nodeName: infer U;
} ? U extends '#text' ? TextNode : DOMElement : never;
declare type DOMNodeAttribute = boolean | string | number;

declare type Props$9 = Except<Styles, 'textWrap'> & {
    /**
     * Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft` and `marginRight`.
     *
     * @default 0
     */
    readonly margin?: number;
    /**
     * Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.
     *
     * @default 0
     */
    readonly marginX?: number;
    /**
     * Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.
     *
     * @default 0
     */
    readonly marginY?: number;
    /**
     * Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft` and `paddingRight`.
     *
     * @default 0
     */
    readonly padding?: number;
    /**
     * Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.
     *
     * @default 0
     */
    readonly paddingX?: number;
    /**
     * Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.
     *
     * @default 0
     */
    readonly paddingY?: number;
};
/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
declare const Box: react.ForwardRefExoticComponent<Except<Styles, "textWrap"> & {
    /**
     * Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft` and `marginRight`.
     *
     * @default 0
     */
    readonly margin?: number | undefined;
    /**
     * Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.
     *
     * @default 0
     */
    readonly marginX?: number | undefined;
    /**
     * Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.
     *
     * @default 0
     */
    readonly marginY?: number | undefined;
    /**
     * Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft` and `paddingRight`.
     *
     * @default 0
     */
    readonly padding?: number | undefined;
    /**
     * Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.
     *
     * @default 0
     */
    readonly paddingX?: number | undefined;
    /**
     * Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.
     *
     * @default 0
     */
    readonly paddingY?: number | undefined;
} & {
    children?: react.ReactNode;
} & react.RefAttributes<DOMElement>>;

interface Props$8 {
    /**
     * Change text color. Ink uses chalk under the hood, so all its functionality is supported.
     */
    readonly color?: LiteralUnion<typeof ForegroundColor, string>;
    /**
     * Same as `color`, but for background.
     */
    readonly backgroundColor?: LiteralUnion<typeof ForegroundColor, string>;
    /**
     * Dim the color (emit a small amount of light).
     */
    readonly dimColor?: boolean;
    /**
     * Make the text bold.
     */
    readonly bold?: boolean;
    /**
     * Make the text italic.
     */
    readonly italic?: boolean;
    /**
     * Make the text underlined.
     */
    readonly underline?: boolean;
    /**
     * Make the text crossed with a line.
     */
    readonly strikethrough?: boolean;
    /**
     * Inverse background and foreground colors.
     */
    readonly inverse?: boolean;
    /**
     * This property tells Ink to wrap or truncate text if its width is larger than container.
     * If `wrap` is passed (by default), Ink will wrap text and split it into multiple lines.
     * If `truncate-*` is passed, Ink will truncate text instead, which will result in one line of text with the rest cut off.
     */
    readonly wrap?: Styles['textWrap'];
    readonly children?: ReactNode;
}
/**
 * This component can display text, and change its style to make it colorful, bold, underline, italic or strikethrough.
 */
declare const Text: FC<Props$8>;

interface Props$7 {
    /**
     * Exit (unmount) the whole Ink app.
     */
    readonly exit: (error?: Error) => void;
}

interface Props$6 {
    /**
     * Stdin stream passed to `render()` in `options.stdin` or `process.stdin` by default. Useful if your app needs to handle user input.
     */
    readonly stdin?: NodeJS.ReadStream;
    /**
     * Ink exposes this function via own `<StdinContext>` to be able to handle Ctrl+C, that's why you should use Ink's `setRawMode` instead of `process.stdin.setRawMode`.
     * If the `stdin` stream passed to Ink does not support setRawMode, this function does nothing.
     */
    readonly setRawMode: (value: boolean) => void;
    /**
     * A boolean flag determining if the current `stdin` supports `setRawMode`. A component using `setRawMode` might want to use `isRawModeSupported` to nicely fall back in environments where raw mode is not supported.
     */
    readonly isRawModeSupported: boolean;
    readonly internal_exitOnCtrlC: boolean;
}

interface Props$5 {
    /**
     * Stdout stream passed to `render()` in `options.stdout` or `process.stdout` by default.
     */
    readonly stdout?: NodeJS.WriteStream;
    /**
     * Write any string to stdout, while preserving Ink's output.
     * It's useful when you want to display some external information outside of Ink's rendering and ensure there's no conflict between the two.
     * It's similar to `<Static>`, except it can't accept components, it only works with strings.
     */
    readonly write: (data: string) => void;
}

interface Props$4 {
    /**
     * Stderr stream passed to `render()` in `options.stderr` or `process.stderr` by default.
     */
    readonly stderr?: NodeJS.WriteStream;
    /**
     * Write any string to stderr, while preserving Ink's output.
     * It's useful when you want to display some external information outside of Ink's rendering and ensure there's no conflict between the two.
     * It's similar to `<Static>`, except it can't accept components, it only works with strings.
     */
    readonly write: (data: string) => void;
}

interface Props$3<T> {
    /**
     * Array of items of any type to render using a function you pass as a component child.
     */
    readonly items: T[];
    /**
     * Styles to apply to a container of child elements. See <Box> for supported properties.
     */
    readonly style?: Styles;
    /**
     * Function that is called to render every item in `items` array.
     * First argument is an item itself and second argument is index of that item in `items` array.
     * Note that `key` must be assigned to the root component.
     */
    readonly children: (item: T, index: number) => ReactNode;
}
/**
 * `<Static>` component permanently renders its output above everything else.
 * It's useful for displaying activity like completed tasks or logs - things that
 * are not changing after they're rendered (hence the name "Static").
 *
 * It's preferred to use `<Static>` for use cases like these, when you can't know
 * or control the amount of items that need to be rendered.
 *
 * For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display
 * a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it
 * to display a list of generated pages, while still displaying a live progress bar.
 */
declare const Static: {
    <T>(props: Props$3<T>): JSX.Element;
    displayName: string;
};

interface Props$2 {
    /**
     * Function which transforms children output. It accepts children and must return transformed children too.
     */
    readonly transform: (children: string) => string;
    readonly children?: ReactNode;
}
/**
 * Transform a string representation of React components before they are written to output.
 * For example, you might want to apply a gradient to text, add a clickable link or create some text effects.
 * These use cases can't accept React nodes as input, they are expecting a string.
 * That's what <Transform> component does, it gives you an output string of its child components and lets you transform it in any way.
 */
declare const Transform: FC<Props$2>;

interface Props$1 {
    /**
     * Number of newlines to insert.
     *
     * @default 1
     */
    readonly count?: number;
}
/**
 * Adds one or more newline (\n) characters. Must be used within <Text> components.
 */
declare const Newline: FC<Props$1>;

/**
 * A flexible space that expands along the major axis of its containing layout.
 * It's useful as a shortcut for filling all the available spaces between elements.
 */
declare const Spacer: FC;

/**
 * Handy information about a key that was pressed.
 */
interface Key {
    /**
     * Up arrow key was pressed.
     */
    upArrow: boolean;
    /**
     * Down arrow key was pressed.
     */
    downArrow: boolean;
    /**
     * Left arrow key was pressed.
     */
    leftArrow: boolean;
    /**
     * Right arrow key was pressed.
     */
    rightArrow: boolean;
    /**
     * Page Down key was pressed.
     */
    pageDown: boolean;
    /**
     * Page Up key was pressed.
     */
    pageUp: boolean;
    /**
     * Return (Enter) key was pressed.
     */
    return: boolean;
    /**
     * Escape key was pressed.
     */
    escape: boolean;
    /**
     * Ctrl key was pressed.
     */
    ctrl: boolean;
    /**
     * Shift key was pressed.
     */
    shift: boolean;
    /**
     * Tab key was pressed.
     */
    tab: boolean;
    /**
     * Backspace key was pressed.
     */
    backspace: boolean;
    /**
     * Delete key was pressed.
     */
    delete: boolean;
    /**
     * [Meta key](https://en.wikipedia.org/wiki/Meta_key) was pressed.
     */
    meta: boolean;
}
declare type Handler = (input: string, key: Key) => void;
interface Options {
    /**
     * Enable or disable capturing of user input.
     * Useful when there are multiple useInput hooks used at once to avoid handling the same input several times.
     *
     * @default true
     */
    isActive?: boolean;
}
/**
 * This hook is used for handling user input.
 * It's a more convenient alternative to using `StdinContext` and listening to `data` events.
 * The callback you pass to `useInput` is called for each character when user enters any input.
 * However, if user pastes text and it's more than one character, the callback will be called only once and the whole string will be passed as `input`.
 *
 * ```
 * import {useInput} from 'ink';
 *
 * const UserInput = () => {
 *   useInput((input, key) => {
 *     if (input === 'q') {
 *       // Exit program
 *     }
 *
 *     if (key.leftArrow) {
 *       // Left arrow key pressed
 *     }
 *   });
 *
 *   return …
 * };
 * ```
 */
declare const useInput: (inputHandler: Handler, options?: Options) => void;

/**
 * `useApp` is a React hook, which exposes a method to manually exit the app (unmount).
 */
declare const useApp: () => Props$7;

/**
 * `useStdin` is a React hook, which exposes stdin stream.
 */
declare const useStdin: () => Props$6;

/**
 * `useStdout` is a React hook, which exposes stdout stream.
 */
declare const useStdout: () => Props$5;

/**
 * `useStderr` is a React hook, which exposes stderr stream.
 */
declare const useStderr: () => Props$4;

interface Input {
    /**
     * Enable or disable this component's focus, while still maintaining its position in the list of focusable components.
     */
    isActive?: boolean;
    /**
     * Auto focus this component, if there's no active (focused) component right now.
     */
    autoFocus?: boolean;
    /**
     * Assign an ID to this component, so it can be programmatically focused with `focus(id)`.
     */
    id?: string;
}
interface Output$2 {
    /**
     * Determines whether this component is focused or not.
     */
    isFocused: boolean;
    /**
     * Allows focusing a specific element with the provided `id`.
     */
    focus: (id: string) => void;
}
/**
 * Component that uses `useFocus` hook becomes "focusable" to Ink,
 * so when user presses <kbd>Tab</kbd>, Ink will switch focus to this component.
 * If there are multiple components that execute `useFocus` hook, focus will be
 * given to them in the order that these components are rendered in.
 * This hook returns an object with `isFocused` boolean property, which
 * determines if this component is focused or not.
 */
declare const useFocus: ({ isActive, autoFocus, id: customId }?: Input) => Output$2;

interface Props {
    readonly activeId?: string;
    readonly add: (id: string, options: {
        autoFocus: boolean;
    }) => void;
    readonly remove: (id: string) => void;
    readonly activate: (id: string) => void;
    readonly deactivate: (id: string) => void;
    readonly enableFocus: () => void;
    readonly disableFocus: () => void;
    readonly focusNext: () => void;
    readonly focusPrevious: () => void;
    readonly focus: (id: string) => void;
}

interface Output$1 {
    /**
     * Enable focus management for all components.
     */
    enableFocus: Props['enableFocus'];
    /**
     * Disable focus management for all components. Currently active component (if there's one) will lose its focus.
     */
    disableFocus: Props['disableFocus'];
    /**
     * Switch focus to the next focusable component.
     * If there's no active component right now, focus will be given to the first focusable component.
     * If active component is the last in the list of focusable components, focus will be switched to the first component.
     */
    focusNext: Props['focusNext'];
    /**
     * Switch focus to the previous focusable component.
     * If there's no active component right now, focus will be given to the first focusable component.
     * If active component is the first in the list of focusable components, focus will be switched to the last component.
     */
    focusPrevious: Props['focusPrevious'];
    /**
     * Switch focus to the element with provided `id`.
     * If there's no element with that `id`, focus will be given to the first focusable component.
     */
    focus: Props['focus'];
}
/**
 * This hook exposes methods to enable or disable focus management for all
 * components or manually switch focus to next or previous components.
 */
declare const useFocusManager: () => Output$1;

interface Output {
    /**
     * Element width.
     */
    width: number;
    /**
     * Element height.
     */
    height: number;
}
declare const _default: (node: DOMElement) => Output;

export { Props$7 as AppProps, Box, Props$9 as BoxProps, DOMElement, Instance, Key, Newline, Props$1 as NewlineProps, RenderOptions, Spacer, Static, Props$3 as StaticProps, Props$4 as StderrProps, Props$6 as StdinProps, Props$5 as StdoutProps, Text, Props$8 as TextProps, Transform, Props$2 as TransformProps, _default as measureElement, render, useApp, useFocus, useFocusManager, useInput, useStderr, useStdin, useStdout };
