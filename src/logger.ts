import chalk from 'chalk';
console.log(chalk.level);


export class Logger {
    static getTime(date: Date) {
        return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
    }

    static getDate(date: Date) { return date.getMonth().toString().padStart(2, '0') + '/' + date.getDay().toString().padStart(2, '0') + '/' + date.getFullYear(); }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static log(...args: any[]) {
        const d = new Date();
        const time = Logger.getTime(d);
        const date = Logger.getDate(d);
        console.log(`[${chalk.greenBright('+')}] ${chalk.rgb(140,140,140 )(date + ' ' + time)}:   ` + args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static error(...args: any[]) {
        const d = new Date();
        const time = Logger.getTime(d);
        const date = Logger.getDate(d);
        console.log(`[${chalk.redBright('-')}] ${chalk.rgb(140,140,140 )(date + ' ' + time)}:   ` + args);
    }
    // static log(...args: any[]) {
    //     let d = new Date();
    //     let time = Logger.getTime(d);
    //     let date = Logger.getDate(d);
    //     console.log(`[+] ${date} ${time}:   ` + args);
    // }

    // static error(...args: any[]) {
    //     let d = new Date();
    //     let time = Logger.getTime(d);
    //     let date = Logger.getDate(d);
    //     console.log(`[-] ${date} ${time}:   ` + args);
    // }
}


// console.log(`[${chalk.greenBright('+')}] ${chalk.rgb(140,140,140 )('12/15/2022 07:51:05')}:   A Nice Info Message`);
// console.log(`[${chalk.yellow('*')}] ${chalk.rgb(140,140,140 )('12/15/2022 07:51:05')}:   A Ok Warn Message`);
// console.log(`[${chalk.redBright('-')}] ${chalk.rgb(140,140,140 )('12/15/2022 07:51:05')}:   A Not So Fun Error`);