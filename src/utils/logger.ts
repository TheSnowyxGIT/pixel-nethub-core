import colors = require("colors");

type LogType = "log" | "warn" | "error";

const colorsByType: Record<LogType, colors.Color> = {
  log: colors.white,
  warn: colors.yellow,
  error: colors.red,
};

export default class Logger {
  static log(message: string) {
    new Logger().log(message);
  }

  static warn(message: string) {
    new Logger().warn(message);
  }

  static error(message: string) {
    new Logger().error(message);
  }

  private name: string;
  constructor(name?: string, private color: colors.Color = colors.yellow) {
    this.name = name || "Logger";
  }

  private prefix(type: LogType): string {
    return colorsByType[type](
      `[PNH-CORE] ${process.pid.toString().padEnd(6, " ")} - ${new Date()
        .toLocaleString()
        .padEnd(24, " ")} ${type.toUpperCase().padStart(5, " ")} ${this.color(
        `[${this.name}]`
      )}`
    );
  }

  private write(writer: (...message: string[]) => void, ...messages: string[]) {
    if (process.env.NODE_ENV === "test") return;
    writer.apply(console, messages);
  }

  log(message: string) {
    this.write(console.log, this.prefix("log"), message);
  }

  warn(message: string) {
    this.write(console.warn, this.prefix("warn"), message);
  }

  error(message: string) {
    this.write(console.error, this.prefix("error"), message);
  }
}
