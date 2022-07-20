import postgres from "postgres";
import { getConfig } from "./core/configManager.js";

const config = getConfig();
const sql = postgres(config.db);
export default sql;