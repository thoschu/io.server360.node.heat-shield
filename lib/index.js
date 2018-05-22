const shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    readline = require('readline'),
    moment = require('moment'),
    _ = require('lodash'),
    chalk = require('chalk'),
    {EventEmitter} = require('events'),
    HeatShield = () => {
        (function () {
            const eventEmitter = new EventEmitter();

            if (!shell.which('npm')) {
                shell.echo('Sorry, this script requires npm');
                shell.exit(1);
            } else {
                shell.exec('npm audit', function (code1, stdout1, stderr1) {
                    if (code1 !== 1) {
                        shell.echo('Warn: npm audit failed: ' + stderr1);
                        shell.exec('npm install npm@latest -g', function (code2, stdout2, stderr2) {
                            if (code2 !== 0) {
                                shell.echo('Error: npm install npm@latest -g failed: ' + stderr2);
                                shell.exit(1);
                            } else fn(stdout1);
                        });
                    } else {
                        fn(stdout1);
                    }
                });
            }

            const fn = (stdout1) => {
                let filePath = path.join(__dirname, '../logs/log.txt'),
                    writeableStream = fs.createWriteStream(filePath),
                    readableStream = fs.createReadStream(filePath, {encoding: 'utf8'}),
                    text = stdout1.toString(),
                    i = 0,
                    toDoArr = [];

                (function () {
                    let {callee} = arguments,
                        ok = true,
                        till = 1;

                    do {
                        if (i === till) {
                            const now = moment().format('llll');
                            writeableStream.end(now);
                        } else {
                            ok = writeableStream.write(text);
                        }
                    } while (i++ < till && ok);

                    if (i <= till) {
                        writeableStream.once('drain', callee);
                    }
                })();

                writeableStream.on('error', function (err) {
                    console.error(err);
                });

                writeableStream.on('finish', function () {
                    let readLine = readline.createInterface({
                        input: readableStream
                    });

                    readLine.on('line', line => {
                        line = line.toString();

                        if (_.startsWith(line, '#')) {
                            let tempChunk = line.match(/# Run(.*)to resolve/);
                            tempChunk = tempChunk[1].trim();
                            toDoArr.push(tempChunk);
                        }
                    });

                    readLine.on('close', () => {
                        eventEmitter.emit('toDo', toDoArr);
                    });
                });
            };

            eventEmitter.on('toDo', (toDoArr) => {
                const arrLength = toDoArr.length;

                if (arrLength === 0) {
                    shell.echo(chalk.grey.bgWhiteBright('npm') + " " + chalk.blue.bgWhiteBright.bold('slicker') + " " + chalk.white.bold('comment: ') + chalk.red.bold('No vulnerabilities with suggested patches found!'));
                } else {
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    rl.question('Do you want to eliminate the vulnerabilities? ', answer => {
                        if (answer === 'y' || answer === 'yes') {
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

                    while (i < toDoArr.length) {
                        yield toDoArr[i];
                        i++;
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
                    (async function () {
                        await new Promise(function (resolve, reject) {
                            temp = gen.next();

                            if (temp.value === undefined) {
                                resolve();
                            } else {
                                shell.exec(temp.value, function (code, stdout, stderr) {
                                    if (code === 0) {
                                        resolve(stdout);
                                    } else {
                                        reject(stderr);
                                    }
                                });
                            }
                        });
                    })();
                } while (!temp.done);

                rl.close();
            });
        })();
    };

module.exports = HeatShield;
