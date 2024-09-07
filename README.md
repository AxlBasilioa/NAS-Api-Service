# NAS Api Service
this repo is for only educational porpuse how i might do an API
to upload and download files form my NAS server

### What is a NAS Server
a NAS server is a Storage conected by network meaning "Network Attached Storaged", allow to storage dedicated files between users inside a network or even internet with port forwarding

## How to use it

### required .env file
- read .env.example to build your own .env file
### setup
- clone this repo
- install dependencies
```bash
npm install
```
- you can choose 2 things, run it in a terminal or run it as background
- for background in linux use this command
```bash
nohup node server.js > outputs.log 2>&1 &
```
- for background in windows use this command
```bash
start /b node server.js > outputs.log 2>&1
```
- for terminal porpuse
```bash
node server.js
```
### extra notes
some severe vulnerabilities, this is just for personal porpuse, in case of required as a base in a most huge project, you must try to review the code
- user logs are hardcoded in .env, you might be using a DB
- password doesn't have a salt or pepper extra process to encrypt or tokenize
- download file allows to exit "nasDirectory" variable using '../' directory
- file size isn't restrictive or kind of file isn't restricted so you can upload
malicious file or PB file to break everything

if you just want to use it as me like a personal porpuse is okay, any other porpuse is under your own risk an required review and modify the code

any suggestions feel free to tell me (: