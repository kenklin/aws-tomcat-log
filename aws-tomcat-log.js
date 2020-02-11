"use strict";

const fs = require("fs");
const path = require("path");
const program = require("commander");
const repl = require("repl");

const VERSION = "0.0.1";
const HELP = "Commands are:\n" +
	"  ls(f)   - Lists f and its rotated gzipped log files without unzipping the latter.\n" +
	"  join(f) - Joins f and its rotated gzipped log files after unzipping the latter.";

program
	.version(VERSION)
	.description("Joins an AWS Tomcat Elastic Beanstalk catalina.out daily log " +
		"file with any of its rotated daily logs in chronological order.\n\n" +
		HELP)
	.option("--f <fn>", "Catalina daily log file to ls() or join()")
	.parse(process.argv);

if (!program.f) program.f = "/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log";

var replServer = repl.start({prompt: "> "});

replServer.context.help	= function() {
	console.log(HELP);
};

replServer.context.ls = function(f) {
	var ret = [];

	if (fs.existsSync(f)) {
		let p = path.parse(f);
		const base = p.base;

		// Get rotated subdir name
		let subdir = path.format({dir: p.dir + path.sep + "rotated"});
		if (subdir.endsWith(path.sep)) {	// Remove trailing /
			subdir = subdir.substr(0, subdir.length - path.sep.length);
		}

		// Get corresponding .gz files in rotated subdirectory
		let dir = fs.opendirSync(subdir);
		let dirent = dir.readSync();
		while (dirent) {
			let p = path.parse(dirent.name);
			if (dirent.name.startsWith(base) && p.ext === ".gz") {
				ret.push(path.format({dir: subdir, base: dirent.name}));
			}
			dirent = dir.readSync();
		}
		dir.close();

		// Return rotated .gz files first, then f
		ret.sort();
		ret.push(f);
	}

	return ret;
};

if (program.f) {
	const ret = replServer.context.ls(program.f);
	console.log("ls " + JSON.stringify(ret, null, 2));
}

process.on('exit', function(code) {  
    return console.log(`Exit with code ${code}`);
});
