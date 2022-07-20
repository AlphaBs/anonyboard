import postgres from "postgres";
import { getConfig } from "./core/configManager";

const config = getConfig();
const sql = postgres(config.db);
export default sql;