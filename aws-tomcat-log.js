"use strict";
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const util = require("util");
const pipeline = util.promisify(stream.pipeline);
const zlib = require("zlib");
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
	.option("--out <fn>", "File name of joined output file")
	.option("--quiet")
	.parse(process.argv);

if (!program.f) program.f = "/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log";

if (!program.out) {
	const p = path.parse(program.f);
	program.out = path.format({dir: p.dir, name: p.name, ext: ".out"});
}

var replServer = repl.start({prompt: "> "});

replServer.context.help	= function() {
	console.log(HELP);
};

replServer.context.ls = function(f) {
	var logs = [];	// Ordered array of log files (rotated files has .gz extension)

	if (typeof f === "undefined") {
		f = program.f;
	}
	if (fs.existsSync(f)) {
		let p = path.parse(f);
		const base = p.base;

		// Get rotated subdir name
		let subdir = path.format({dir: p.dir + path.sep + "rotated"});
		if (subdir.endsWith(path.sep)) {	// Remove trailing /
			subdir = subdir.substring(0, subdir.length - path.sep.length);
		}

		// Get corresponding .gz files in rotated subdirectory
		let dir = fs.opendirSync(subdir);
		let dirent = dir.readSync();
		while (dirent) {
			let p = path.parse(dirent.name);
			if (dirent.name.startsWith(base) && p.ext === ".gz") {
				logs.push(path.format({dir: subdir, base: dirent.name}));
			}
			dirent = dir.readSync();
		}
		dir.close();

		// Return rotated .gz files first, then f
		logs.sort();
		logs.push(f);
	}

	return logs;
};

/*
// https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback
async function unzipSync(f, write) {
	await pipeline(
		fs.createReadStream(f),
		zlib.createGunzip(),
		write
	);
	console.log('Pipeline succeeded for ' + f);
}
*/

replServer.context.join = function(f, out) {
	if (typeof out === "undefined") {
		out = program.out;
	}
	
	const logs = replServer.context.ls(f);
	const write = fs.createWriteStream(out);

	logs.forEach(f => {
		const p = path.parse(f);
		var contents = fs.readFileSync(f);
		if (p.ext === ".gz") {
			if (!program.quiet) console.log("joining unzipped " + f);
			contents = zlib.gunzipSync(contents);
		} else { 
			if (!program.quiet) console.log("joining " + f);
		}
		fs.appendFileSync(out, contents);
	});

	return logs;
};
	
if (program.f) {
	const logs = replServer.context.join(program.f);
}

process.on('exit', function(code) {  
    return console.log(`Exit with code ${code}`);
});
