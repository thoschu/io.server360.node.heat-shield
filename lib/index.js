const shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    readline = require('readline'),
    moment = require('moment'),
    R = require('ramda'),
    chalk = require('chalk'),
    {EventEmitter} = require('events'),
    HeatShield = () => {
        (function () {
            const eventEmitter = new EventEmitter();
            if (!shell.which('npm')) {
                shell.echo('Sorry, this script requires npm');
                shell.exit(1);
            } else {
                shell.exec('npm audit', (code1, stdout1, stderr1) => {
                    if (R.not(R.equals(code1, 1))) {
                        const message1 = R.concat('Warn: npm audit failed: ', stderr1);
                        shell.echo(message1);
                        shell.exec('npm install npm@latest -S', (code2, stdout2, stderr2) => {
                            if (code2 !== 0) {
                                const message2 = R.concat('Error: npm install npm@latest -S failed: ', stderr2);
                                shell.echo(message2);
                                shell.exit(1);
                            } else fn(stdout1);
                        });
                    } else {
                        fn(stdout1);
                    }
                });
            }

            const fn = (stdout1) => {
                let filePath = path.join(__dirname, R.concat(R.concat('../logs/', R.toString(Date.now())), '-log.txt')),
                    writeableStream = fs.createWriteStream(filePath),
                    readableStream = fs.createReadStream(filePath, {encoding: 'utf8'}),
                    text = stdout1.toString(),
                    i = 0,
                    toDoArr = [],
                    directory = path.join(__dirname, '../logs/');

                fs.readdir(directory, (err, files) => {
                    if (err) throw err;
                    for (let file of files) {
                        if (R.and(R.not(R.equals(file, '.gitkeep')), R.not(R.endsWith(file, filePath)))) {
                            fs.unlink(path.join(directory, file), err => {
                                if (err) throw err;
                            });
                        }
                    }
                });

                (function () {
                    let {callee} = arguments,
                        ok = R.T(),
                        till = 1;

                    do {
                        if (R.equals(i, till)) {
                            const now = moment().format('llll');
                            writeableStream.end(now);
                        } else {
                            ok = writeableStream.write(text);
                        }
                    } while (R.and(R.lt(i = R.inc(i), till), ok));

                    if (R.lte(i, till)) {
                        writeableStream.once('drain', callee);
                    }
                })();

                writeableStream.on('error', err => console.error(err));

                writeableStream.on('finish', () => {
                    let readLine = readline.createInterface({
                        input: readableStream
                    });

                    readLine.on('line', line => {
                        line = R.toString(line);

                        if (R.startsWith('#', line)) {
                            let tempChunk = line.match(/# Run(.*)to resolve/);
                            tempChunk = R.nth(1, tempChunk);
                            tempChunk = R.trim(tempChunk);
                            toDoArr = R.append(tempChunk, toDoArr);
                        }
                    });

                    readLine.on('close', () => {
                        eventEmitter.emit('toDo', toDoArr);
                    });
                });
            };

            eventEmitter.on('toDo', toDoArr => {
                const arrLength = R.length(toDoArr);

                if (R.equals(arrLength, 0)) {
                    const partOne = R.concat(chalk.grey.bgWhiteBright('npm'), " "),
                        partTwo = R.concat(partOne, chalk.blue.bgWhiteBright.bold('heat-shield')),
                        partThree = R.concat(partTwo, " "),
                        partFour = R.concat(partThree, chalk.white.bold('comment: ')),
                        message = R.concat(partFour, chalk.red.bold('No vulnerabilities with suggested patches found!'));

                    shell.echo(message);
                } else {
                    const rl = readline.createInterface({
                        input: R.prop('stdin', process),
                        output: R.prop('stdout', process),
                    });

                    rl.question('Do you want to eliminate the vulnerabilities? ', answer => {
                        if (R.or(R.equals(answer,'y'), R.equals(answer, 'yes'))) {
                            eventEmitter.emit('yes', toDoArr, rl);
                        } else {
                            eventEmitter.emit('no', rl);
                        }
                    });
                }
            });

            eventEmitter.on('yes', (toDoArr, rl) => {
                const genFn = function* () {
                    let i = 0;

                    while (R.lt(i, R.length(toDoArr))) {
                        yield R.nth(i, toDoArr);
                        i = R.inc(i);
                    }
                };

                eventEmitter.emit('resolve', genFn(), rl);
            });

            eventEmitter.on('no', rl => {
                rl.close();
            });

            eventEmitter.on('resolve', (gen, rl) => {
                let temp;

                do {
                    (async () => {
                        await new Promise((resolve, reject) => {
                            const command = R.prop('value', temp),
                                argumentsAreUndefined = R.equals(command, undefined);

                            temp = gen.next();

                            if (argumentsAreUndefined) {
                                resolve();
                            } else {
                                shell.exec(command, (code, stdout, stderr) => {
                                    const argumentsAreEquivalent = R.equals(code, 0);

                                    if (argumentsAreEquivalent) {
                                        resolve(stdout);
                                    } else {
                                        reject(stderr);
                                    }
                                });
                            }
                        });
                    })();
                } while (R.not(R.prop('done', temp)));

                rl.close();
            });
        })();
    };

/**
 * Updates some vulnerabilities
 * @return {void}
 */
module.exports = HeatShield;
