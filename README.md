aws-tomcat-log
==============
The **aws-tomcat-log** REPL joins an AWS Tomcat Elastic Beanstalk daily
catalina.out log file with any of that day's rotated logs in chronological
order to create one complete daily log file.

The interactive and single-command examples below show our interest in the 2020-01-25 logs.
## Interactive
```
klin@Kens-MacBook-Pro:aws-tomcat-log$ node aws-tomcat-log
> help()
Commands are:
  ls(f)   - Lists f and its rotated gzipped log files without unzipping the latter.
  join(f,out) - Joins f and its rotated gzipped log files after unzipping the latter.
undefined
```
```
> ls("/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log")
[
  '/Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579975261.gz',
  '/Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579986061.gz',
  '/Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579996861.gz',
  '/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log'
]
```
```
> join("/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log", "out.log")
joining unzipped /Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579975261.gz
joining unzipped /Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579986061.gz
joining unzipped /Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579996861.gz
joining /Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log
[
  '/Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579975261.gz',
  '/Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579986061.gz',
  '/Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579996861.gz',
  '/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log'
]
> .exit
Exit with code 0
```

## Single command
```
klin@Kens-MacBook-Pro:aws-tomcat-log$ node aws-tomcat-log --help
Usage: aws-tomcat-log [options]

Joins an AWS Tomcat Elastic Beanstalk catalina.out daily log file with any of its rotated daily logs in chronological order.

Commands are:
  ls(f)   - Lists f and its rotated gzipped log files without unzipping the latter.
  join(f,out) - Joins f and its rotated gzipped log files after unzipping the latter.

Options:
  -V, --version  output the version number
  --f <fn>       Catalina daily log file to ls() or join()
  --out <fn>     File name of joined output file
  --quiet        
  -h, --help     output usage information
```
```
klin@Kens-MacBook-Pro:aws-tomcat-log$ node aws-tomcat-log --f "/Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log" --out "out.log"
> joining unzipped /Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579975261.gz
joining unzipped /Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579986061.gz
joining unzipped /Users/klin/Downloads/var/log/tomcat8/rotated/catalina.2020-01-25.log1579996861.gz
joining /Users/klin/Downloads/var/log/tomcat8/catalina.2020-01-25.log
```
