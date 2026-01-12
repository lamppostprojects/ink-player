import { init } from "./engine/shared/init";
import screens from "./story/screens";
import settings from "./story/settings";

import "./story/styles.scss";

init({ ...settings, screens });
