import type { Screen } from "../engine/shared/types";
import { About } from "./About";
import { Glossary } from "./Glossary";
import { References } from "./References";

/**
 * The screens available to the user. These are displayed in the sidebar
 * and in the header (on mobile).
 *
 * There are two built-in screens: "Game" and "History".
 * Those must have the id of "game" and "history", respectively,
 * but can have custom titles. The only required screen is "Game".
 *
 * Additionally, there is a "Achievements" screen and can be added by adding
 * the following to the screens array:
 *
 * {
 *     id: "achievements",
 *     title: "Achievements",
 *     component: "achievements",
 * },
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
        id: "glossary",
        title: "Glossary",
        component: Glossary,
    },
    {
        id: "references",
        title: "References",
        component: References,
    },
    {
        id: "achievements",
        title: "Achievements",
        component: "achievements",
    },
] satisfies Screen[];
