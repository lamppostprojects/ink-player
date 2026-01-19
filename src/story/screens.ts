import type { Screen } from "../engine/shared/types";
import { About } from "./About";

/**
 * The screens available to the user. These are displayed in the sidebar
 * and in the header (on mobile).
 *
 * There are three built-in screens: "Game", "History", and "Achievements".
 * Those must have the id of "game", "history", and "achievements", respectively,
 * but can have custom titles. The only required screen is "Game".
 *
 * You can reorder the screens however you like, the first listed screen
 * will be shown to the user by default.
 *
 * You can also add custom screens by providing a component. The component
 * will be rendered in a tab, and can be any valid React component.
 *
 * The component is provided with the following props:
 * - setPage: A function to navigate to a different screen
 * - loading: A boolean indicating if the game is loading
 */
export default [
    {
        id: "home",
        title: "Home",
        component: About,
    },
    {
        id: "game",
        title: "Story",
        component: "Game",
    },
    {
        id: "history",
        title: "History",
        component: "History",
    },
    {
        id: "achievements",
        title: "Achievements",
        component: "Achievements",
    },
] satisfies Screen[];
